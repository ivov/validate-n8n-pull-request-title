const TYPES = [
  "feat",
  "fix",
  "perf",
  "test",
  "docs",
  "refactor",
  "build",
  "ci",
];

const SCOPES = ["API", "core", "editor"];

const NO_CHANGELOG = "(no-changelog)";

const ERRORS = {
  CONVENTIONAL_SCHEMA_MISMATCH: [
    "PR title does not conform to PR title convention.",
    `Please use \`type(scope): subject\` or \`type: subject\`, where \`type\` is one of {${TYPES}} and scope is one of {${SCOPES}} or may be omitted.`,
    "For the subject, mind the whitespace, use initial lowercase and omit final period.",
  ].join("\n"),
  TICKET_NUMBER_PRESENT: "PR title must not contain a ticket number",
  TYPE_NOT_FOUND: "Failed to find type in PR title",
  INVALID_TYPE: `Unknown \`type\` in PR title. Expected one of {${TYPES}}`,
  INVALID_SCOPE: `Unknown \`scope\` in PR title. Expected one of {${SCOPES}} or a node scope, e.g. Mattermost Node`,
  UPPERCASE_INITIAL_IN_SUBJECT: "First char of subject must be lowercase",
  FINAL_PERIOD_IN_SUBJECT: "Subject must not end with a period",
  NO_PRESENT_TENSE_IN_SUBJECT:
    "Subject must use present tense, e.g. `implement` instead of `implemented`",
  SKIP_CHANGELOG_NOT_SUFFIX:
    "Changelog must be in suffix position, e.g. `docs(Mattermost Node): fix typo (no-changelog)`",
};

const REGEXES = {
  CONVENTIONAL_SCHEMA: /(?<type>\w+)(\((?<scope>.*)\))?!?: (?<subject>.*)/,
  TICKET: /n8n-\d{3,5}/i,
};

const ALL_NODES_DISPLAY_NAMES_FOR_TESTING_ONLY = [
  "Action Network",
  "ActiveCampaign",
  "ActiveCampaign Trigger",
  "Acuity Scheduling Trigger",
  "Adalo",
  "Affinity",
  "Affinity Trigger",
  "Agile CRM",
  "Airtable",
  "Airtable Trigger",
  "AMQP Sender",
  "AMQP Trigger",
  "APITemplate.io",
  "Asana",
  "Asana Trigger",
  "Automizy",
  "Autopilot",
  "Autopilot Trigger",
  "AWS Lambda",
  "AWS SNS",
  "AWS SNS Trigger",
  "AWS Comprehend",
  "AWS DynamoDB",
  "AWS Rekognition",
  "AWS S3",
  "AWS SES",
  "AWS SQS",
  "AWS Textract",
  "AWS Transcribe",
  "BambooHR",
  "Bannerbear",
  "Baserow",
  "Beeminder",
  "Bitbucket Trigger",
  "Bitly",
  "Bitwarden",
  "Box",
  "Box Trigger",
  "Brandfetch",
  "Bubble",
  "Cal Trigger",
  "Calendly Trigger",
  "Chargebee",
  "Chargebee Trigger",
  "CircleCI",
  "Webex by Cisco",
  "Webex by Cisco Trigger",
  "Clearbit",
  "ClickUp",
  "ClickUp Trigger",
  "Clockify",
  "Clockify Trigger",
  "Cockpit",
  "Coda",
  "CoinGecko",
  "Compression",
  "Contentful",
  "ConvertKit",
  "ConvertKit Trigger",
  "Copper",
  "Copper Trigger",
  "Cortex",
  "CrateDB",
  "Cron",
  "Crypto",
  "Customer.io",
  "Customer.io Trigger",
  "Date & Time",
  "DeepL",
  "Demio",
  "DHL",
  "Discord",
  "Discourse",
  "Disqus",
  "Drift",
  "Dropbox",
  "Dropcontact",
  "Edit Image",
  "E-goi",
  "Elasticsearch",
  "Elastic Security",
  "EmailReadImap",
  "Send Email",
  "Emelia",
  "Emelia Trigger",
  "ERPNext",
  "Error Trigger",
  "Eventbrite Trigger",
  "Execute Command",
  "Execute Workflow",
  "Facebook Graph API",
  "Facebook Trigger",
  "Figma Trigger (Beta)",
  "FileMaker",
  "Flow",
  "Flow Trigger",
  "Form.io Trigger",
  "Formstack Trigger",
  "Freshdesk",
  "Freshservice",
  "Freshworks CRM",
  "FTP",
  "Function",
  "Function Item",
  "GetResponse",
  "GetResponse Trigger",
  "Ghost",
  "Git",
  "GitHub",
  "Github Trigger",
  "GitLab",
  "GitLab Trigger",
  "Google Ads",
  "Google Analytics",
  "Google BigQuery",
  "Google Books",
  "Google Calendar",
  "Google Calendar Trigger",
  "Google Chat",
  "Google Cloud Natural Language",
  "Google Cloud Storage",
  "Google Contacts",
  "Google Docs",
  "Google Drive",
  "Google Drive Trigger",
  "Google Cloud Firestore",
  "Google Cloud Realtime Database",
  "Gmail",
  "Gmail Trigger",
  "G Suite Admin",
  "Google Perspective",
  "Google Sheets ",
  "Google Slides",
  "Google Tasks",
  "Google Translate",
  "YouTube",
  "Gotify",
  "GoToWebinar",
  "Grafana",
  "GraphQL",
  "Grist",
  "Gumroad Trigger",
  "Hacker News",
  "HaloPSA",
  "Harvest",
  "HelpScout",
  "HelpScout Trigger",
  "HighLevel",
  "Home Assistant",
  "HTML Extract",
  "HTTP Request",
  "HubSpot",
  "HubSpot Trigger",
  "Humantic AI",
  "Hunter",
  "iCalendar",
  "IF",
  "Intercom",
  "Interval",
  "Invoice Ninja",
  "Invoice Ninja Trigger",
  "Item Lists",
  "Iterable",
  "Jenkins",
  "Jira Software",
  "Jira Trigger",
  "JotForm Trigger",
  "Kafka",
  "Kafka Trigger",
  "Keap",
  "Keap Trigger",
  "Kitemaker",
  "KoBoToolbox",
  "KoBoToolbox Trigger",
  "Lemlist",
  "Lemlist Trigger",
  "Line",
  "Linear",
  "Linear Trigger",
  "LingvaNex",
  "LinkedIn",
  "Local File Trigger",
  "Magento 2",
  "Mailcheck",
  "Mailchimp",
  "Mailchimp Trigger",
  "MailerLite",
  "MailerLite Trigger",
  "Mailgun",
  "Mailjet",
  "Mailjet Trigger",
  "Mandrill",
  "Markdown",
  "Marketstack",
  "Matrix",
  "Mattermost",
  "Mautic",
  "Mautic Trigger",
  "Medium",
  "Merge",
  "MessageBird",
  "Metabase",
  "Microsoft Dynamics CRM",
  "Microsoft Excel",
  "Microsoft Graph Security",
  "Microsoft OneDrive",
  "Microsoft Outlook",
  "Microsoft SQL",
  "Microsoft Teams",
  "Microsoft To Do",
  "Mindee",
  "MISP",
  "Mocean",
  "Monday.com",
  "MongoDB",
  "Monica CRM",
  "Move Binary Data",
  "MQTT",
  "MQTT Trigger",
  "MSG91",
  "MySQL",
  "n8n",
  "Customer Datastore (n8n training)",
  "Customer Messenger (n8n training)",
  "n8n Trigger",
  "NASA",
  "Netlify",
  "Netlify Trigger",
  "Nextcloud",
  "NocoDB",
  "SendInBlue",
  "SendInBlue Trigger",
  "Sticky Note",
  "No Operation, do nothing",
  "Onfleet",
  "Onfleet Trigger",
  "Notion (Beta)",
  "Notion Trigger (Beta)",
  "Odoo",
  "One Simple API",
  "OpenThesaurus",
  "OpenWeatherMap",
  "Orbit",
  "Oura",
  "Paddle",
  "PagerDuty",
  "PayPal",
  "PayPal Trigger",
  "Peekalink",
  "Phantombuster",
  "Philips Hue",
  "Pipedrive",
  "Pipedrive Trigger",
  "Plivo",
  "PostBin",
  "Postgres",
  "PostHog",
  "Postmark Trigger",
  "ProfitWell",
  "Pushbullet",
  "Pushcut",
  "Pushcut Trigger",
  "Pushover",
  "QuestDB",
  "Quick Base",
  "QuickBooks Online",
  "RabbitMQ",
  "RabbitMQ Trigger",
  "Raindrop",
  "Read Binary File",
  "Read Binary Files",
  "Read PDF",
  "Reddit",
  "Redis",
  "Redis Trigger",
  "Rename Keys",
  "Respond to Webhook",
  "RocketChat",
  "RSS Read",
  "Rundeck",
  "S3",
  "Salesforce",
  "Salesmate",
  "SeaTable",
  "SeaTable Trigger",
  "SecurityScorecard",
  "Segment",
  "SendGrid",
  "Sendy",
  "Sentry.io",
  "ServiceNow",
  "Set",
  "Shopify",
  "Shopify Trigger",
  "SIGNL4",
  "Slack",
  "sms77",
  "Snowflake",
  "Split In Batches",
  "Splunk",
  "Spontit",
  "Spotify",
  "Spreadsheet File",
  "SSE Trigger",
  "SSH",
  "Stackby",
  "Start",
  "Stop and Error",
  "Storyblok",
  "Strapi",
  "Strava",
  "Strava Trigger",
  "Stripe",
  "Stripe Trigger",
  "Supabase",
  "SurveyMonkey Trigger",
  "Switch",
  "SyncroMSP",
  "Taiga",
  "Taiga Trigger",
  "Tapfiliate",
  "Telegram",
  "Telegram Trigger",
  "TheHive",
  "TheHive Trigger",
  "TimescaleDB",
  "Todoist",
  "Toggl Trigger",
  "TravisCI",
  "Trello",
  "Trello Trigger",
  "Twake",
  "Twilio",
  "Twist",
  "Twitter",
  "Typeform Trigger",
  "Unleashed Software",
  "Uplead",
  "uProc",
  "UptimeRobot",
  "urlscan.io",
  "Vero",
  "Vonage",
  "Wait",
  "Webflow",
  "Webflow Trigger",
  "Webhook",
  "Wekan",
  "WhatsApp Business Cloud",
  "Wise",
  "Wise Trigger",
  "WooCommerce",
  "WooCommerce Trigger",
  "Wordpress",
  "Workable Trigger",
  "Workflow Trigger",
  "Write Binary File",
  "Wufoo Trigger",
  "Xero",
  "XML",
  "Yourls",
  "Zammad",
  "Zendesk",
  "Zendesk Trigger",
  "Zoho CRM",
  "Zoom",
  "Zulip",
];

const PARSER_CONTENT = `
import { readFileSync } from \\"fs\\";
import glob from \\"fast-glob\\";
import ts from \\"typescript\\";

async function getDisplayNames() {
  const files = await glob(\\"packages/nodes-base/nodes/**/*.node.ts\\");

  return files.reduce<string[]>((acc, cur) => {
    const displayName = getDisplayName(cur);

    // main file for versioned node has no description
    // e.g. packages/nodes-base/nodes/BambooHr/BambooHr.node.ts
    if (displayName) acc.push(displayName);

    return acc;
  }, []);
}

function getDisplayName(fileName: string) {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015
  );

  const classDeclaration = sourceFile.statements.find(
    (s) => s.kind === ts.SyntaxKind.ClassDeclaration
  ) as ts.ClassDeclaration;

  const descriptionPropertyDeclaration = classDeclaration.members
    .filter(
      (m): m is ts.PropertyDeclaration =>
        m.kind === ts.SyntaxKind.PropertyDeclaration
    )
    .find(
      (m) =>
        m.name?.kind === ts.SyntaxKind.Identifier &&
        m.name.escapedText === \\"description\\" &&
        m.initializer?.kind === ts.SyntaxKind.ObjectLiteralExpression
    ) as ts.PropertyDeclaration & {
    initializer: ts.SyntaxKind.ObjectLiteralExpression & {
      properties: ts.PropertyAssignment[];
    };
  };

  // for versioned nodes
	// TODO: clean up
	if (!descriptionPropertyDeclaration) {
		type TargetConstructor = ts.SyntaxKind.Constructor & {
			body: {
				statements: Array<
					ts.SyntaxKind.VariableStatement & {
						declarationList: { declarations: ts.NodeArray<ts.VariableDeclaration> };
					}
				>;
			};
		};

		const constructor = classDeclaration.members.find(
			(m) => m.kind === ts.SyntaxKind.Constructor,
		) as TargetConstructor | undefined;

		if (!constructor) return;

		const [varStatement] = constructor?.body?.statements;

		if (!varStatement) return;

		// @ts-ignore
		descriptionPropertyDeclaration = varStatement.declarationList?.declarations[0];
	}

	if (!descriptionPropertyDeclaration) return;

  const propertyAssignment =
    descriptionPropertyDeclaration.initializer.properties.find(
      (p) =>
        p.kind === ts.SyntaxKind.PropertyAssignment &&
        p.name.kind === ts.SyntaxKind.Identifier &&
        p.name.escapedText === \\"displayName\\" &&
        p.initializer.kind === ts.SyntaxKind.StringLiteral
    ) as ts.PropertyAssignment & { initializer: { text: string } };

  return propertyAssignment.initializer.text;
}

getDisplayNames().then((result) => console.log(JSON.stringify(result)));
`;

module.exports = {
  TYPES,
  SCOPES,
  NO_CHANGELOG,
  ERRORS,
  REGEXES,
  ALL_NODES_DISPLAY_NAMES_FOR_TESTING_ONLY,
  PARSER_CONTENT,
};
