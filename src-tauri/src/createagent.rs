use dotenv::dotenv;
use postgres::{Client, NoTls};
use serde::{Deserialize, Serialize};
use std::env;
use std::error::Error;
use tauri::utils::config::HookCommand;

#[derive(Serialize, Deserialize)]
pub struct AgentConfiguration {
    name: String,
    bio: String,
    interval: i32,
    lore: Vec<String>,
    objectives: Vec<String>,
    knowledge: Vec<String>,
    external_plugins: Vec<String>,
    internal_plugins: Vec<String>,
    memory: bool,
    autonomous: bool,
}

fn database_connection(agent_config: &AgentConfiguration) -> Result<Client, Box<dyn Error>> {
    dotenv().ok();
    let host: String = env::var("POSTGRES_HOST").unwrap_or("localhost".to_string());
    let user: String = env::var("POSTGRES_USER").unwrap_or("admin".to_string());
    let password: String = env::var("POSTGRES_PASSWORD").unwrap_or("admin".to_string());
    let dbname: String = env::var("POSTGRES_DB").unwrap_or("postgres".to_string());
    let connection_string = format!(
        "host={} user={} password={} dbname={}",
        host, user, password, dbname
    );
    let mut client: Client = match Client::connect(&connection_string, NoTls) {
        Ok(client) => client,
        Err(e) => {
            eprintln!("Erreur de connexion à la base de données: {}", e);
            return Err(e.into());
        }
    };

    let internal_plugins_lowercase: Vec<String> = agent_config
        .internal_plugins
        .iter()
        .map(|s| s.to_lowercase())
        .collect();

    match client.batch_execute(
        "
          CREATE TABLE IF NOT EXISTS agents (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          bio TEXT,
          interval INTEGER NOT NULL,
          lore TEXT[],
          objectives TEXT[],
          knowledge TEXT[],
          external_plugins TEXT[],
          internal_plugins TEXT[],
          memory BOOLEAN NOT NULL DEFAULT FALSE,
          autonomous BOOLEAN NOT NULL DEFAULT FALSE,
          mcp BOOLEAN NOT NULL DEFAULT FALSE
      );
      ",
    ) {
        Ok(_) => println!("Table 'agents' created or already exists."),
        Err(e) => println!("Error creating table 'agents': {}", e),
    }
    match client.execute(
        "INSERT INTO agents (name, bio, lore, interval, objectives, knowledge, external_plugins, internal_plugins, memory, autonomous) \
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        &[
            &agent_config.name,
            &agent_config.bio,
            &agent_config.lore,
            &agent_config.interval,
            &agent_config.objectives,
            &agent_config.knowledge,
            &agent_config.external_plugins,
            &internal_plugins_lowercase,
            &agent_config.memory,
            &agent_config.autonomous,
        ],
    ) {
        Ok(rows) => {
            println!("{}, Success : the rows has been inserted.", rows);
            if rows == 0 {
                println!("Warn : No rows were inserted into 'agents'.");
            }
        }
        Err(e) => {
            println!("Error while insert agents: {}", e);
        }
    }

    Ok(client)
}

#[tauri::command]
pub fn submit_agent_config(agent_config: AgentConfiguration) -> bool {
    match database_connection(&agent_config) {
        Ok(_client) => {
            println!("Successfully connected to database");
            return true;
        }
        Err(error) => {
            eprintln!("Failed to connect to database: {}", error);
            return false;
        }
    }
}

#[tauri::command]
pub fn get_agents_config() -> Vec<AgentConfiguration> {
    dotenv().ok();
    let host: String = env::var("POSTGRES_HOST").unwrap_or("localhost".to_string());
    let user: String = env::var("POSTGRES_USER").unwrap_or("admin".to_string());
    let password: String = env::var("POSTGRES_PASSWORD").unwrap_or("admin".to_string());
    let dbname: String = env::var("POSTGRES_DB").unwrap_or("postgres".to_string());
    println!("Host: {}", host);
    let connection_string = format!(
        "host={} user={} password={} dbname={}",
        host, user, password, dbname
    );
    let mut client: Client = match Client::connect(&connection_string, NoTls) {
        Ok(client) => client,
        Err(e) => {
            eprintln!("Error connect to database: {}", e);
            let empty: Vec<AgentConfiguration> = vec![];
            return empty;
        }
    };
    let rows = client
        .query("SELECT * FROM agents", &[])
        .expect("Failed to query database");
    let agents: Vec<AgentConfiguration> = rows
        .iter()
        .map(|row| AgentConfiguration {
            name: row.get(1),
            bio: row.get(2),
            interval: row.get(3),
            lore: row.get(4),
            objectives: row.get(5),
            knowledge: row.get(6),
            external_plugins: row.get(7),
            internal_plugins: row.get(8),
            memory: row.get(9),
            autonomous: row.get(10),
        })
        .collect();
    agents
}
