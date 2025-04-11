mod createagent;
mod error;
mod server;
use tauri_plugin_http::reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use tauri::{Manager, WebviewWindow};
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;
use tokio::time::{sleep, Duration};

#[derive(Serialize, Deserialize)]
pub struct ServerStateResponse {
    status: String,
}
pub struct ServerState {
    status: bool,
    port: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .setup(setup)
        .invoke_handler(tauri::generate_handler![
            download,
            createagent::submit_agent_config,
            createagent::get_agents_config,
            server::server_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // Start Running the Server
    let app_handle = app.handle().clone();
    let app_handle_for_ui = app.handle().clone();
    tauri::async_runtime::spawn(async move {
        let shell = app_handle.shell();
        match shell.command("pnpm").args(["run", "start:server"]).spawn() {
            Ok((mut rx, child)) => {
                println!("Server Launch On PID : {:?}", child.pid());

                while let Some(event) = rx.recv().await {
                    match event {
                        CommandEvent::Error(err) => {
                            println!("ServerState: {}", err);
                        }
                        CommandEvent::Terminated(status) => {
                            println!("Server end with status: {}", status.code.unwrap_or(-1));
                            break;
                        }
                        _ => {
                            println!("Other element receive from server: {:?}", event);
                        }
                    }
                }
            }
            Err(err) => {
                eprintln!("Error during server start: {:?}", err);
            }
        }
    });

    // HealthCheck Async Function
    tauri::async_runtime::spawn(async move {
        let client: Client = tauri_plugin_http::reqwest::Client::new();
        let mut server_state: ServerState = ServerState {
            status: false,
            port: "".to_string(),
        };
        // loop {
        //     let _path = env::current_dir().unwrap();
        //     let content = fs::read_to_string("../common/server_port.txt");
        //     println!("Waiting for server to be ready...");
        //     println!("Content : {:?}", content);
        //     match content {
        //         Ok(content) => {
        //             server_state.port = content;
        //             break;
        //         }
        //         Err(_) => {
        //             println!("Server not ready yet...");
        //         }
        //     }
        // }
        server_state.port ="4004".to_string();
        println!("Server port : {:?}", server_state.port);
        loop {
            match client
                .get(format!(
                    "http://127.0.0.1:{}/api/key/healthcheck",
                    server_state.port
                ))
                .header("x-api-key", "test")
                .send()
                .await
            {
                Ok(response) => {
                    if response.status().is_success() {
                        let text = response.text().await.unwrap();

                        let server_state_response: ServerStateResponse = serde_json::from_str(&text).unwrap();
                        println!("Server state: {:?}", server_state_response.status);
                        if server_state_response.status == "success" && server_state.status == false
                        {
                            server_state.status = true;
                            let splash_window: WebviewWindow = app_handle_for_ui
                                .get_webview_window("splashscreen")
                                .unwrap();
                            let main_window: WebviewWindow =
                                app_handle_for_ui.get_webview_window("main").unwrap();
                            splash_window.close().unwrap();
                            main_window.show().unwrap();
                            println!("Server is ready switching view");
                        }
                    } else if server_state.status == true {
                        server_state.status = false;
                        app_handle_for_ui
                            .emit("server-not-ready", "Server has been killed")
                            .unwrap();
                        let splash_window =
                            match app_handle_for_ui.get_webview_window("splashscreen") {
                                Some(window) => window,
                                None => {
                                    eprintln!("Window splashscreen does not exist");
                                    panic!("Fenêtre splash introuvable");
                                }
                            };

                        let main_window: WebviewWindow =
                            app_handle_for_ui.get_webview_window("main").unwrap();
                        main_window.close().unwrap();
                        splash_window.show().unwrap();
                        println!("Server has been killed");
                    } else {
                        println!("Server not ready yet...");
                    }
                }
                Err(e) => {
                    println!("No Server Response: {:?}", e);
                }
            }
            if server_state.status == false {
                sleep(Duration::from_secs(1)).await;
            } else {
                sleep(Duration::from_secs(10)).await;
            }
        }
    });

    println!("Configuration lancée, le serveur démarre en arrière-plan");
    Ok(())
}

use tauri::{AppHandle, Emitter};

#[tauri::command]
fn download(app: AppHandle, url: String) {
    app.emit("download-started", &url).unwrap();
    for progress in [1, 15, 50, 80, 100] {
        app.emit("download-progress", progress).unwrap();
    }
    app.emit("download-finished", &url).unwrap();
}
