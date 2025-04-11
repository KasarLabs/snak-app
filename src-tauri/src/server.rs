use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs;

#[derive(Serialize, Deserialize, Debug)]
pub struct OutputResponse {
    index: i32,
    r#type: String,
    text: String,
    status: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse {
    input: String,
    output: Vec<OutputResponse>,
}

pub async fn server_get_request(
    input: &str,
    agentconfig: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    println!("Input: {:?}", input);
    println!("AgentConfig: {:?}", agentconfig);
    let client = reqwest::Client::new();
    let body_data = json!({
        "request": input,
        "agentName": agentconfig,
    });
    let mut port: String = "4004".to_string();
    // let content = fs::read_to_string("../common/server_port.txt").unwrap();
    // port = content;

    let response = client
        .post(format!("http://localhost:{}/api/key/request", port))
        .header("Content-Type", "application/json")
        .header("x-api-key", "test")
        .json(&body_data)
        .send()
        .await?;

        let api_response = match response.json::<ApiResponse>().await {
            Ok(parsed) => {
                println!("Désérialisation réussie!");
                parsed
            },
            Err(e) => {
                eprintln!("Erreur de désérialisation: {:?}", e);
                // Vous pouvez aussi logger le corps de la réponse pour déboguer
                return Err(e.into());
            }
        };
        

    println!("Output: {:?}", api_response.output[0].text.clone());
    Ok(api_response.output[0].text.clone())
}

#[tauri::command]
pub async fn server_request(input: &str, agentconfig: &str) -> Result<String, String> {
    server_get_request(input, agentconfig)
        .await
        .map_err(|e| e.to_string())
}
