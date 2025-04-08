// Script pour récupérer les données de l'API Glama MCP
const fs = require("fs");
const path = require("path");
const https = require("https");

// Configuration de l'API
const API_BASE_URL = "glama.ai";
const API_PATH = "/api/mcp";
const API_TOKEN = "YOUR_API_TOKEN"; // Remplacez par votre token d'API

// Fonction pour effectuer une requête HTTPS
function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = JSON.parse(responseBody);
            resolve(data);
          } else {
            reject(
              new Error(`Erreur HTTP: ${res.statusCode} - ${responseBody}`),
            );
          }
        } catch (error) {
          reject(new Error(`Erreur de parsing JSON: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Fonction pour construire les options de requête
function buildRequestOptions(path, params = {}) {
  // Construire la chaîne de requête à partir des paramètres
  const queryParams = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  const fullPath = queryParams ? `${path}?${queryParams}` : path;

  return {
    hostname: API_BASE_URL,
    path: fullPath,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    },
  };
}

// Fonction principale
async function main() {
  try {
    console.log("Récupération des données depuis l'API Glama MCP...");

    // Récupération de tous les serveurs
    const servers = await fetchAllServers();
    console.log(`${servers.length} serveurs récupérés`);

    // Récupération des attributs
    const attributes = await fetchAttributes();
    console.log(`${attributes.length} attributs récupérés`);

    // Transformation des données au format Plugin
    const plugins = transformToPlugins(servers, attributes);
    console.log(`${plugins.length} plugins générés`);

    // Ajout des plugins existants (ceux que vous avez déjà dans votre fichier)
    console.log("Ajout des plugins existants...");
    addExistingPlugins(plugins);

    // Création du fichier de sortie
    writePluginsFile(plugins);
    console.log("Fichier généré avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'exécution:", error.message);
  }
}

// Fonction pour ajouter les plugins existants dans votre code
function addExistingPlugins(plugins) {
  // Liste des plugins existants avec leurs IDs pour éviter les doublons
  const existingPlugins = [
    {
      id: "a5dcf686-50ee-41f5-bdcb-44eaacbeaf81",
      name: "Core",
      description: "",
      image: "/logos/starknet.png",
      actions: [],
    },
    {
      id: "8d3e05ef-c85a-43cc-8e57-486e94fcf39e",
      name: "Unruggable",
      description:
        "Create secure, transparent memecoins with built-in protections against common exploits and rug pulls",
      image: "/logos/unruggable.png",
      actions: [
        /* ... actions existantes ... */
      ],
    },
    // Ajoutez ici les autres plugins existants que vous souhaitez conserver
    // Vous pouvez les copier depuis votre fichier plugins.ts actuel
  ];

  // Ajouter uniquement les plugins qui n'existent pas déjà dans notre liste
  existingPlugins.forEach((plugin) => {
    if (!plugins.some((p) => p.id === plugin.id)) {
      plugins.push(plugin);
    }
  });
}

// Fonction pour récupérer tous les serveurs avec pagination
async function fetchAllServers() {
  let allServers = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const params = { first: 100 };
    if (cursor) {
      params.after = cursor;
    }

    const response = await httpsRequest(
      buildRequestOptions(`${API_PATH}/v1/servers`, params),
    );

    const { servers, pageInfo } = response;
    allServers = [...allServers, ...servers];

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;

    console.log(
      `Récupéré ${servers.length} serveurs, page ${cursor || "initiale"}`,
    );
  }

  return allServers;
}

// Fonction pour récupérer les détails d'un serveur spécifique
async function fetchServerDetails(serverId) {
  const response = await httpsRequest(
    buildRequestOptions(`${API_PATH}/v1/servers/${serverId}`),
  );
  return response;
}

// Fonction pour récupérer tous les attributs
async function fetchAttributes() {
  const response = await httpsRequest(
    buildRequestOptions(`${API_PATH}/v1/attributes`),
  );
  return response.attributes;
}

// Fonction pour obtenir l'URL de l'image GitHub
function getGithubImageUrl(repositoryUrl) {
  if (!repositoryUrl) return "/logos/default.png";

  // Extraction du nom d'utilisateur et du repo depuis l'URL GitHub
  const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return "/logos/default.png";

  const [, username, repo] = match;

  // Utilisons plutôt l'icône GitHub du dépôt ou un logo par défaut
  // Cette URL redirige vers l'avatar GitHub du propriétaire du dépôt
  return `https://github.com/${username}.png`;

  // Alternative: on pourrait aussi utiliser l'image générée par GitHub pour le repo
  // return `https://opengraph.githubassets.com/1/${username}/${repo}`;
}

// Fonction pour transformer les serveurs en plugins
function transformToPlugins(servers, attributes) {
  // Utilisation d'un Map pour éviter les doublons basés sur l'ID
  const pluginsMap = new Map();

  servers.forEach((server) => {
    // Si ce serveur existe déjà dans notre Map, on ne l'ajoute pas à nouveau
    if (!pluginsMap.has(server.id)) {
      // Création des actions à partir des outils du serveur
      const actions = server.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description || `Action for ${tool.name}`,
          parameters: tool.inputSchema
            ? createParametersFromSchema(tool.inputSchema)
            : [],
        };
      });

      // Extraire le nom du référentiel pour l'utiliser comme fallback pour le nom du plugin
      let repoName = "";
      const githubUrl = server.repository?.url || null;

      if (githubUrl) {
        const match = githubUrl.match(/github\.com\/(?:[^\/]+)\/([^\/]+)/);
        if (match) {
          repoName = match[1].replace(/-/g, " ").replace(/_/g, " ");
          // Mettre en majuscule la première lettre de chaque mot
          repoName = repoName
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      // Création de l'objet Plugin
      const plugin = {
        id: server.id,
        name: server.name || repoName || `Plugin ${server.id.substring(0, 8)}`,
        description:
          server.description || `Plugin based on ${githubUrl || "MCP server"}`,
        image: githubUrl ? getGithubImageUrl(githubUrl) : "/logos/default.png",
        actions: actions,
        // Ajouter l'URL du dépôt GitHub si elle existe
        githubUrl: githubUrl,
      };

      // Ajout au Map pour éviter les doublons
      pluginsMap.set(server.id, plugin);
    }
  });

  // Conversion du Map en tableau
  return Array.from(pluginsMap.values());
}

// Fonction pour créer des paramètres à partir d'un schéma (simplifié)
function createParametersFromSchema(schema) {
  if (!schema || !schema.properties) return [];

  return Object.entries(schema.properties).map(([name, prop]) => {
    return {
      name,
      type: mapJsonSchemaToType(prop),
      description: prop.description || `Parameter: ${name}`,
      required: schema.required?.includes(name) || false,
    };
  });
}

// Fonction pour mapper les types JSON Schema vers des types simples
function mapJsonSchemaToType(prop) {
  if (prop.type === "array") {
    if (prop.items && prop.items.type) {
      return `${prop.items.type} array`;
    }
    return "array";
  }
  return prop.type || "string";
}

// Fonction pour écrire le fichier de plugins
function writePluginsFile(plugins) {
  // Formatage du code JavaScript
  let fileContent = `import { Plugin } from "../src/app/plugins/utils/types";\n\n`;

  // Map pour suivre les noms de variables utilisés et éviter les doublons
  const usedVarNames = new Map();

  // Création de chaque variable de plugin
  plugins.forEach((plugin, index) => {
    let baseName = camelCase(plugin.name);
    let varName = `${baseName}Plugin`;
    let counter = 1;

    // Si le nom de variable existe déjà, ajouter un suffixe numérique
    while (usedVarNames.has(varName)) {
      varName = `${baseName}${counter}Plugin`;
      counter++;
    }

    // Mémoriser le nom de variable pour éviter les doublons futurs
    usedVarNames.set(varName, true);

    // Stocker le nom de variable pour chaque plugin pour l'export
    plugin._varName = varName;

    fileContent += `const ${varName}: Plugin = ${JSON.stringify(plugin, null, 2)};\n\n`;
  });

  // Export de tous les plugins
  fileContent += `export const allPlugins: Array<Plugin> = [\n`;
  plugins.forEach((plugin) => {
    fileContent += `  ${plugin._varName},\n`;
    // Supprimer la propriété temporaire
    delete plugin._varName;
  });
  fileContent += `];\n`;

  // Écriture du fichier
  fs.writeFileSync(path.join(process.cwd(), "plugins.ts"), fileContent);
}

// Utilitaire pour convertir un nom en camelCase
function camelCase(str) {
  return str
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .map((word, index) => {
      return index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

// Exécution du script
main();
