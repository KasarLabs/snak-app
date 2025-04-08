import { Plugin } from "../src/app/plugins/utils/types";

const corePlugin: Plugin = {
  id: "a5dcf686-50ee-41f5-bdcb-44eaacbeaf81",
  name: "Core",
  description: "",
  image: "/logos/starknet.png",
  actions: [],
};

const unruggablePlugin: Plugin = {
  id: "8d3e05ef-c85a-43cc-8e57-486e94fcf39e",
  name: "Unruggable",
  description:
    "Create secure, transparent memecoins with built-in protections against common exploits and rug pulls",
  image: "/logos/unruggable.png",

  actions: [
    {
      name: "Create Memecoin",
      description:
        "Deploy a new memecoin contract with built-in security features and customizable parameters",
      parameters: [
        {
          name: "owner",
          type: "string",
          description: "Owner address of the memecoin",
          required: true,
        },
        {
          name: "name",
          type: "string",
          description: "Name of the memecoin",
          required: true,
        },
        {
          name: "symbol",
          type: "string",
          description: "Symbol of the memecoin",
          required: true,
        },
        {
          name: "initialSupply",
          type: "string",
          description:
            "Initial supply of tokens (will be scaled by 18 decimals)",
          required: true,
        },
      ],
    },
    {
      name: "Verify Memecoin",
      description:
        "Check if a contract is a legitimate memecoin created by the Unruggable Factory",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "Address of the contract to verify",
          required: true,
        },
      ],
    },
    {
      name: "Launch on Ekubo",
      description:
        "Launch memecoin on Ekubo DEX with concentrated liquidity and trading restrictions",
      parameters: [
        {
          name: "memecoinAddress",
          type: "string",
          description: "Address of the memecoin to launch",
          required: true,
        },
        {
          name: "transferRestrictionDelay",
          type: "number",
          description: "Delay in seconds before transfers are allowed",
          required: true,
        },
        {
          name: "maxPercentageBuyLaunch",
          type: "number",
          description:
            "Maximum percentage of tokens that can be bought at launch",
          required: true,
        },
        {
          name: "startingPrice",
          type: "string",
          description: "Initial trading price of the token",
          required: true,
        },
      ],
    },
    {
      name: "Check Locked Liquidity",
      description:
        "Verify if a memecoin has locked liquidity and get detailed information about the liquidity lock",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "Address of the memecoin contract to check",
          required: true,
        },
      ],
    },
  ],
};

const vesuPlugin: Plugin = {
  id: "9d3e05ef-c85a-43cc-8e57-486e94fcf40f",
  name: "Vesu",
  description:
    "Deposit and withdraw tokens to earn yield in the Vesu DeFi protocol",
  image: "/logos/vesu.png",
  actions: [
    {
      name: "Deposit Earn",
      description: "Deposit tokens into Vesu protocol to earn yield",
      parameters: [
        {
          name: "depositTokenSymbol",
          type: "string",
          description: "Symbol of the token to deposit (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "depositAmount",
          type: "string",
          description: "Amount of tokens to deposit",
          required: true,
        },
      ],
    },
    {
      name: "Withdraw Earn",
      description: "Withdraw tokens and earned yield from Vesu protocol",
      parameters: [
        {
          name: "withdrawTokenSymbol",
          type: "string",
          description: "Symbol of the token to withdraw",
          required: true,
        },
      ],
    },
  ],
};

const avnuPlugin: Plugin = {
  id: "7d3e05ef-c85a-43cc-8e57-486e94fcf38e",
  name: "AVNU",
  description:
    "Decentralized exchange aggregator for swapping tokens on Starknet with the best rates",
  image: "/logos/avnu.png",

  actions: [
    {
      name: "Swap Tokens",
      description: "Swap tokens using the best available routes and rates",
      parameters: [
        {
          name: "sellTokenSymbol",
          type: "string",
          description: "Symbol of the token to sell (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "buyTokenSymbol",
          type: "string",
          description: "Symbol of the token to buy (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "sellAmount",
          type: "string",
          description: "Amount of tokens to sell",
          required: true,
        },
      ],
    },
    {
      name: "Fetch Route",
      description:
        "Get the best route and quote for a token swap without executing it",
      parameters: [
        {
          name: "sellTokenSymbol",
          type: "string",
          description: "Symbol of the token to sell (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "buyTokenSymbol",
          type: "string",
          description: "Symbol of the token to buy (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "sellAmount",
          type: "number",
          description: "Amount of tokens to sell",
          required: true,
        },
      ],
    },
  ],
};

const coingeckoPlugin: Plugin = {
  id: "6d3e05ef-c85a-43cc-8e57-486e94fcf37e",
  name: "CoinGecko",
  description:
    "Get real-time cryptocurrency prices, market data, and trends using CoinGecko API",
  image: "/logos/coingecko.png",

  actions: [
    {
      name: "Check Server Status",
      description: "Check if the CoinGecko API server is operational",
    },
    {
      name: "Check Token Price",
      description: "Get current price for specified tokens in USD",
      parameters: [
        {
          name: "tokenNames",
          type: "string",
          description:
            'Comma-separated list of token names (e.g., "bitcoin,ethereum")',
          required: true,
        },
      ],
    },
    {
      name: "List Supported Tokens",
      description: "Get a list of all supported tokens/currencies on CoinGecko",
    },
    {
      name: "Trending Search List",
      description: "Get list of trending cryptocurrency searches",
    },
  ],
};

const dexscreenerPlugin: Plugin = {
  id: "5d3e05ef-c85a-43cc-8e57-486e94fcf36e",
  name: "Dexscreener",
  description: "",
  image: "/logos/dexscreener.png",
  actions: [],
};

const artpeacePlugin: Plugin = {
  id: "4d3e05ef-c85a-43cc-8e57-486e94fcf35e",
  name: "Artpeace",
  description: "",
  image: "/logos/artpeace.png",
  actions: [],
};

const twitterPlugin: Plugin = {
  id: "3d3e05ef-c85a-43cc-8e57-486e94fcf34e",
  name: "Twitter",
  description:
    "Interact with Twitter/X platform - post tweets, manage threads, follow users, and retrieve information",
  image: "/logos/twitter.png",
  actions: [
    {
      name: "createTwitterPost",
      description: "Create and publish a new tweet",
      parameters: [
        {
          name: "post",
          type: "string",
          description: "Content of the tweet to be posted",
          required: true,
        },
      ],
    },
    {
      name: "replyTweet",
      description: "Reply to an existing tweet",
      parameters: [
        {
          name: "tweet_id",
          type: "string",
          description: "ID of the tweet to reply to",
          required: true,
        },
        {
          name: "response_text",
          type: "string",
          description: "Content of the reply tweet",
          required: true,
        },
      ],
    },
    {
      name: "createAndPostTwitterThread",
      description: "Create and post a thread of multiple tweets",
      parameters: [
        {
          name: "thread",
          type: "string[]",
          description: "Array of tweet contents that will form the thread",
          required: true,
        },
      ],
    },
    {
      name: "followXUserFromUsername",
      description: "Follow a Twitter user by their username",
      parameters: [
        {
          name: "username",
          type: "string",
          description: "Username of the account to follow",
          required: true,
        },
      ],
    },
    {
      name: "getLastUserTweet",
      description: "Retrieve the most recent tweet from a specified user",
      parameters: [
        {
          name: "account_name",
          type: "string",
          description: "Username of the account to get the latest tweet from",
          required: true,
        },
      ],
    },
    {
      name: "getLastTweetsOptions",
      description: "Search and retrieve tweets based on a query",
      parameters: [
        {
          name: "query",
          type: "string",
          description: "Search query for finding tweets",
          required: true,
        },
        {
          name: "maxTweets",
          type: "number",
          description: "Maximum number of tweets to retrieve",
          required: true,
        },
      ],
    },
    {
      name: "getLastTweetsFromUser",
      description: "Retrieve recent tweets from a specified user",
      parameters: [
        {
          name: "username",
          type: "string",
          description: "Username of the account to get tweets from",
          required: true,
        },
        {
          name: "maxTweets",
          type: "number",
          description: "Maximum number of tweets to retrieve",
          required: false,
        },
      ],
    },
    {
      name: "getLastTweetsAndRepliesFromUser",
      description: "Retrieve recent tweets and replies from a specified user",
      parameters: [
        {
          name: "username",
          type: "string",
          description: "Username of the account to get tweets and replies from",
          required: true,
        },
        {
          name: "maxTweets",
          type: "number",
          description: "Maximum number of tweets and replies to retrieve",
          required: false,
        },
      ],
    },
    {
      name: "getTwitterUserIdFromUsername",
      description: "Get the Twitter user ID for a given username",
      parameters: [
        {
          name: "username",
          type: "string",
          description: "Username to get the ID for",
          required: true,
        },
      ],
    },
    {
      name: "getTwitterProfileFromUsername",
      description: "Get the Twitter profile information for a given username",
      parameters: [
        {
          name: "username",
          type: "string",
          description: "Username to get the profile information for",
          required: true,
        },
      ],
    },
  ],
};

const discordPlugin: Plugin = {
  id: "1e489b06-d538-4e29-8412-2e4724a777e3",
  name: "Discord",
  description: "Interact with Discord",
  image: "/logos/discord.png",
  actions: [
    {
      name: "DiscordChannelSearchTool",
      description: "",
      parameters: [],
    },
    {
      name: "DiscordGetGuildsTool",
      description: "",
      parameters: [],
    },
    {
      name: "DiscordGetMessagesTool",
      description: "",
      parameters: [],
    },
    {
      name: "DiscordGetTextChannelsTool",
      description: "",
      parameters: [],
    },
    {
      name: "DiscordSendMessagesTool",
      description: "",
      parameters: [],
    },
  ],
};

const telegramPlugin: Plugin = {
  id: "297bf546-ba26-4556-a65c-2317ba710d32",
  name: "Telegram",
  description: "",
  image: "/logos/telegram.png",
  actions: [],
};

const duckduckgoPlugin: Plugin = {
  id: "544bb4dd-4c2f-42da-95be-cbbc86f0585e",
  name: "Duckduckgo",
  description:
    "A plugin that performs web searches using DuckDuckGo's search engine, as part of LangChain tools.",
  image: "/logos/duckduckgo.png",
  actions: [
    {
      name: "Invoke",
      description: "Perform a search query using DuckDuckGo",
      parameters: [
        {
          name: "input",
          type: "string",
          description: "The search query to execute",
          required: true,
        },
      ],
    },
  ],
};

const dallEPlugin: Plugin = {
  id: "68290790-695f-4aaa-bb8c-95583899b47a",
  name: "Dall-E",
  description:
    "A powerful AI image generation plugin that creates unique images from textual description, as part of LangChain tools.",
  image: "/logos/dallE.png",
  actions: [
    {
      name: "Invoke",
      description:
        "Generate an image based on a text prompt and return its URL",
      parameters: [
        {
          name: "input",
          type: "string",
          description: "Text description of the image you want to generate",
          required: true,
        },
      ],
    },
  ],
};

const gmailPlugin: Plugin = {
  id: "0a463a27-f236-4f2a-88f5-ab6c4a4da9a9",
  name: "Gmail",
  description:
    "Interact with Gmail to manage emails, drafts, and threads, as part of LangChain tools.",
  image: "/logos/gmail.png",
  actions: [
    {
      name: "GmailCreateDraft",
      description: "",
      parameters: [],
    },
    {
      name: "GmailGetMessage",
      description: "",
      parameters: [],
    },
    {
      name: "GmailGetThread",
      description: "",
      parameters: [],
    },
    {
      name: "GmailSearch",
      description: "",
      parameters: [],
    },
    {
      name: "GmailSendMessage",
      description: "",
      parameters: [],
    },
  ],
};

const gcalendarPlugin: Plugin = {
  id: "3a15ea40-0211-48c9-a3a8-1b9c92502ab6",
  name: "Google Calendar",
  description:
    "Manage Google Calendar events, schedules, and calendars with features for creating, updating, and querying calendar data, as part of LangChain tools.",
  image: "/logos/gcalendar.png",
  actions: [
    {
      name: "GoogleCalendarCreateTool",
      description: "",
      parameters: [],
    },
    {
      name: "GoogleCalendarViewTool",
      description: "",
      parameters: [],
    },
  ],
};

const searchapiPlugin: Plugin = {
  id: "fe276fc9-3b3d-438d-bb4f-b613aef97531",
  name: "Search API",
  description:
    "Search and retrieve current news articles from various sources using Google News engine, with support for filtering, sorting, and customized results, as part of LangChain tools.",
  image: "/logos/searchapi.png",
  actions: [],
};

const wikipediaPlugin: Plugin = {
  id: "c36dd777-e209-4c7d-b60c-57003c53d9de",
  name: "Wikipedia",
  description:
    "Search and retrieve information from Wikipedia, including articles, summaries, and related content, as part of LangChain tools.",
  image: "/logos/wikipedia.png",
  internal: false,
  actions: [],
};

const coinmarketcapPlugin: Plugin = {
  id: "22caebb4-27ec-425a-9868-bbf15e381249",
  name: "CoinMarketCap",
  description: "",
  image: "/logos/coinmarketcap.png",
  actions: [],
};

const atlanticPlugin: Plugin = {
  id: "abd3235d-67d0-4a33-a506-00fd5811481f",
  name: "Atlantic",
  description:
    "A plugin for interacting with Atlantic's proof generation and verification services",
  image: "/logos/atlantic.png",
  actions: [
    {
      name: "getProof",
      description: "Generate a proof by uploading a ZIP file to Atlantic",
      parameters: [
        {
          name: "agent",
          type: "StarknetAgentInterface",
          description: "The Starknet agent interface",
          required: true,
        },
        {
          name: "param",
          type: "AtlanticParam",
          description: "The Atlantic parameters, including the filename",
          required: true,
        },
      ],
    },
    {
      name: "verifyProof",
      description: "Verify a proof using the Atlantic service",
      parameters: [
        {
          name: "agent",
          type: "StarknetAgentInterface",
          description: "The Starknet agent interface",
          required: true,
        },
        {
          name: "param",
          type: "AtlanticParam",
          description: "The Atlantic parameters, including the filename",
          required: true,
        },
      ],
    },
  ],
};

const argentxPlugin: Plugin = {
  id: "4d3e0dc1-c027-491c-8d50-a337a38ec10d",
  name: "Argent X",
  description: "Interact with Argent X accounts on Starknet",
  image: "/logos/argentx.png",
  actions: [
    {
      name: "createNewArgentAccount",
      description: "Creates a new Argent account and returns credentials",
      parameters: [],
    },
    {
      name: "deployExistingArgentAccount",
      description:
        "Deploy an existing Argent X Account and returns the deploy transaction address",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "The address of the account's contract",
          required: true,
        },
        {
          name: "publicKey",
          type: "string",
          description: "The public key of the account",
          required: true,
        },
        {
          name: "privateKey",
          type: "string",
          description: "The private key of the account",
          required: true,
        },
      ],
    },
  ],
};

const openzeppelinPlugin: Plugin = {
  id: "0a0d8122-0fa7-4278-b207-1ea0277e99ed",
  name: "OpenZeppelin",
  description: "Interact with OpenZeppelin accounts on Starknet",
  image: "/logos/openzeppelin.png",
  actions: [
    {
      name: "createNewOpenzeppelinAccount",
      description: "Creates a new OpenZeppelin account and returns credentials",
      parameters: [],
    },
    {
      name: "deployExistingOpenzeppelinAccount",
      description:
        "Deploy an existing OpenZeppelin Account and returns the deploy transaction address",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "The address of the account's contract",
          required: true,
        },
        {
          name: "publicKey",
          type: "string",
          description: "The public key of the account",
          required: true,
        },
        {
          name: "privateKey",
          type: "string",
          description: "The private key of the account",
          required: true,
        },
      ],
    },
  ],
};

const okxPlugin: Plugin = {
  id: "e9e7054e-e3b1-4b9a-ae69-53371e9b4a02",
  name: "OKX",
  description: "Interact with OKX accounts on Starknet",
  image: "/logos/okx.png",
  actions: [
    {
      name: "createNewOkxAccount",
      description: "Creates a new OKX account and returns credentials",
      parameters: [],
    },
    {
      name: "deployExistingOkxAccount",
      description:
        "Deploy an existing OKX Account and returns the deploy transaction address",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "The address of the account's contract",
          required: true,
        },
        {
          name: "publicKey",
          type: "string",
          description: "The public key of the account",
          required: true,
        },
        {
          name: "privateKey",
          type: "string",
          description: "The private key of the account",
          required: true,
        },
      ],
    },
  ],
};

const braavosPlugin: Plugin = {
  id: "ae0057b0-e6e7-40bc-a22f-6afa5addb57a",
  name: "Braavos",
  description: "Interact with Braavos accounts on Starknet",
  image: "/logos/braavos.png",
  actions: [
    {
      name: "createNewBraavosAccount",
      description: "Creates a new Braavos account and returns credentials",
      parameters: [],
    },
    {
      name: "deployExistingBraavosAccount",
      description:
        "Deploy an existing Braavos Account and returns the deploy transaction address",
      parameters: [
        {
          name: "contractAddress",
          type: "string",
          description: "The address of the account's contract",
          required: true,
        },
        {
          name: "publicKey",
          type: "string",
          description: "The public key of the account",
          required: true,
        },
        {
          name: "privateKey",
          type: "string",
          description: "The private key of the account",
          required: true,
        },
      ],
    },
  ],
};

const pragmaPlugin: Plugin = {
  id: "f5ed5517-267b-4d4e-b4ba-1dab110d6dbd",
  name: "Pragma",
  description: "",
  image: "/logos/pragma.png",
  actions: [],
};

const madaraPlugin: Plugin = {
  id: "62121657-9286-4002-ab6d-5c984232477a",
  name: "Madara",
  description: "",
  image: "/logos/madara.png",
  actions: [],
};

const fibrousPlugin: Plugin = {
  id: "cc0f610c-29c4-4377-a51c-20f31838df71",
  name: "Fibrous",
  description:
    "The best decentralized liquidity platform on Starknet for swapping tokens",
  image: "/logos/fibrous.png",
  actions: [
    {
      name: "Swap Tokens on Fibrous",
      description: "Swap tokens using the best available routes and rates",
      parameters: [
        {
          name: "sellTokenSymbol",
          type: "string",
          description: "Symbol of the token to sell (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "buyTokenSymbol",
          type: "string",
          description: "Symbol of the token to buy (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "sellAmount",
          type: "string",
          description: "Amount of tokens to sell",
          required: true,
        },
      ],
    },
    {
      name: "Fetch Route on Fibrous",
      description:
        "Get the best route and quote for a token swap without executing it",
      parameters: [
        {
          name: "sellTokenSymbol",
          type: "string",
          description: "Symbol of the token to sell (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "buyTokenSymbol",
          type: "string",
          description: "Symbol of the token to buy (e.g., ETH, USDC)",
          required: true,
        },
        {
          name: "sellAmount",
          type: "number",
          description: "Amount of tokens to sell",
          required: true,
        },
      ],
    },
    {
      name: "Batch Swap on Fibrous",
      description:
        "Swap multiple tokens using the best available routes and rates in a single transaction",
      parameters: [
        {
          name: "sellTokenSymbols",
          type: "string array",
          description:
            "Symbols of the tokens to sell (e.g., [ETH, USDT, STRK], USDC)",
          required: true,
        },
        {
          name: "buyTokenSymbol",
          type: "string array",
          description: "Symbol of the token to buy (e.g., [ETH], [USDC])",
          required: true,
        },
        {
          name: "sellAmount",
          type: "number array",
          description: "Amounts of tokens to sell",
          required: true,
        },
      ],
    },
  ],
};

const opusPlugin: Plugin = {
  id: "3b4794c7-0b9a-4d7e-b57e-2683d4a26026",
  name: "Opus",
  description:
    "Interact with the Opus DeFi protocol and borrow CASH, the first native decentralized USD-pegged stablecoin on Starknet",
  image: "/logos/opus.png",

  actions: [
    {
      name: "openTrove",
      description: "Deposit tokens into Opus protocol and borrow CASH",
      parameters: [
        {
          name: "collaterals",
          type: "[string, string][]",
          description:
            "An array of tuples, each containing the symbol of the token to deposit (e.g., ETH, STRK) and amount to deposit",
          required: true,
        },
        {
          name: "borrowAmount",
          type: "string",
          description: "Amount of CASH to borrow",
          required: true,
        },
        {
          name: "maxBorrowFeePct",
          type: "string",
          description:
            "Maximum borrow fee to pay as a percentage of borrow amount",
          required: true,
        },
      ],
    },
    {
      name: "depositTrove",
      description: "Deposit tokens into a Trove on Opus protocol",
      parameters: [
        {
          name: "troveId",
          type: "number",
          description: "Trove ID to deposit collateral into",
          required: true,
        },
        {
          name: "collateral",
          type: "[string, string]",
          description:
            "A tuple containing the symbol of the token to deposit (e.g., ETH, STRK) and amount to deposit",
          required: true,
        },
      ],
    },
    {
      name: "withdrawTrove",
      description: "Withdraw tokens from a Trove on Opus protocol",
      parameters: [
        {
          name: "troveId",
          type: "number",
          description: "Trove ID to withdraw collateral from",
          required: true,
        },
        {
          name: "collateral",
          type: "[string, string]",
          description:
            "A tuple containing the symbol of the token to withdraw (e.g., ETH, STRK) and amount to withdraw",
          required: true,
        },
      ],
    },
    {
      name: "borrowTrove",
      description: "Borrow CASH from a Trove on Opus protocol",
      parameters: [
        {
          name: "troveId",
          type: "number",
          description: "Trove ID to borrow CASH with",
          required: true,
        },
        {
          name: "amount",
          type: "string",
          description: "Amount of CASH to borrow",
          required: true,
        },
        {
          name: "maxBorrowFeePct",
          type: "string",
          description:
            "Maximum borrow fee to pay as a percentage of borrow amount",
          required: true,
        },
      ],
    },
    {
      name: "repayTrove",
      description: "Repay CASH for a Trove on Opus protocol",
      parameters: [
        {
          name: "troveId",
          type: "number",
          description: "Trove ID to repay CASH for",
          required: true,
        },
        {
          name: "amount",
          type: "string",
          description: "Amount of CASH to repay",
          required: true,
        },
      ],
    },
    {
      name: "getUserTroves",
      description: "Get a list of Trove IDs for an address on Opus protocol",
      parameters: [
        {
          name: "user",
          type: "string",
          description: "Address of the user",
          required: true,
        },
      ],
    },
    {
      name: "getTroveHealth",
      description: "Get a Trove's health on Opus protocol",
      parameters: [
        {
          name: "troveId",
          type: "number",
          description: "Trove ID to fetch data for",
          required: true,
        },
      ],
    },
    {
      name: "getBorrowFee",
      description: "Get the current borrow fee on Opus protocol",
    },
  ],
};

export const allPlugins: Array<Plugin> = [
  corePlugin,

  argentxPlugin,
  braavosPlugin,
  openzeppelinPlugin,
  okxPlugin,
  unruggablePlugin,
  vesuPlugin,
  opusPlugin,

  avnuPlugin,
  coingeckoPlugin,
  dexscreenerPlugin,
  artpeacePlugin,
  twitterPlugin,
  discordPlugin,
  telegramPlugin,
  duckduckgoPlugin,
  dallEPlugin,
  gmailPlugin,
  gcalendarPlugin,
  wikipediaPlugin,

  searchapiPlugin,
  atlanticPlugin,
  coinmarketcapPlugin,
  pragmaPlugin,
  madaraPlugin,
  fibrousPlugin,
];
