use reqwest::{Client};
use serde_json::json;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct OutputResponse {
    index: i32,
    r#type : String,
    text : String,
    status: String,
}
#[derive(Serialize, Deserialize)]
pub struct  ApiResponse {
    input: String,
    output: Vec<OutputResponse>,
}

pub async fn server_get_request(input: &str, agentconfig : &str) -> Result<String, Box<dyn std::error::Error>> {
    println!("Input: {:?}", input);
    println!("AgentConfig: {:?}", agentconfig);
    let client = reqwest::Client::new();
    let body_data = json!({
        "request": input,
        "agentName": agentconfig,
    });

    let response = client.post("http://localhost:3001/api/key/request")
        .header("Content-Type", "application/json")
        .header("x-api-key", "test")
        .json(&body_data)
        .send()
        .await?;
    
    let api_response: ApiResponse = response.json().await?;

    println!("Output: {:?}", api_response.output[0].text.clone());
    Ok(api_response.output[0].text.clone())
}

#[tauri::command]
pub async fn server_request(input: &str, agentconfig : &str) -> Result<String, String> {
    server_get_request(input, agentconfig).await.map_err(|e| e.to_string())
}