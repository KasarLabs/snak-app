mod createagent;
mod server;

use std::thread;
use tokio::time::{Duration, sleep};
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize)]
pub struct ApiHealthCheckReponse {
    status: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(setup)
        .invoke_handler(tauri::generate_handler![
            my_custom_command,
            greet,
            download,
            createagent::submit_agent_config,
            createagent::get_agents_config,
            server::server_request
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use tauri_plugin_shell::process::CommandEvent;

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
  let app_handle = app.handle().clone();
  let app_handle_for_ui = app.handle().clone();
  
  // Tâche 1: Lancer et surveiller le serveur
  tauri::async_runtime::spawn(async move {
      let shell = app_handle.shell();
      match shell.command("pnpm").args(["start:server"]).spawn() {
          Ok((mut rx, child)) => {
              println!("Server Launch On PID : {:?}", child.pid());
              
              // Monitoring du serveur dans sa propre tâche
              while let Some(event) = rx.recv().await {
                  match event {
                      CommandEvent::Stdout(line) => {
                          // println!("Server (stdout): {}", String::from_utf8_lossy(&line));
                      },
                      CommandEvent::Stderr(line) => {
                          // println!("Server (stderr): {}", String::from_utf8_lossy(&line));
                      },
                      CommandEvent::Error(err) => {
                          println!("ServerState: {}", err);
                      },
                      CommandEvent::Terminated(status) => {
                          println!("Server end with status: {}", status.code.unwrap_or(-1));
                          break;
                      },
                      _ => {
                          println!("Other element receive from server: {:?}", event);
                      }
                  }
              }
          },
          Err(err) => {
              eprintln!("Erreur lors du démarrage du serveur: {:?}", err);
          }
      }
  });
  
  tauri::async_runtime::spawn(async move {
    let mut i = 0;  // Ajout du mut pour permettre l'incrémentation
    let client = reqwest::Client::new();
    
    while true {
        match client
            .get("http://localhost:3001/api/key/healthcheck")
            .header("x-api-key", "test")
            .send()
            .await {
                Ok(response) => {
                    // Maintenant nous avons un Response, pas un Result<Response, Error>
                    match response.json::<ApiHealthCheckReponse>().await {
                        Ok(api_response) => {
                            println!("API Health Check: {:?}", api_response.status);
                            if api_response.status == "success" {
                                println!("Le serveur est prêt ! {}", api_response.status);
                                break;
                            }
                        },
                        Err(e) => {
                            println!("Erreur lors de la désérialisation de la réponse: {:?}", e);
                        }
                    }
                },
                Err(e) => {
                    println!("Erreur lors de la requête: {:?}", e);
                }
            }
        
        // Ajouter un délai entre les tentatives
        sleep(Duration::from_millis(500)).await;
        i += 1;
    }

    let splash_window = app_handle_for_ui.get_webview_window("splashscreen").unwrap();
    let main_window = app_handle_for_ui.get_webview_window("main").unwrap();
    splash_window.close().unwrap();
    main_window.show().unwrap();
    println!("Transition d'interface terminée");
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

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}
