# FinUP — AI-Powered Personal Finance Manager

FinUP is a personal finance and expense-management web application built with Python and Flask. It brings expense tracking, natural-language expense entry, voice transcription, financial chat, budgeting, analytics, and report exports into one application.

> **Project note:** Features described here reflect the project's intended implementation. Run the application and test each workflow to confirm behavior in your environment.

## Features

- **Expense management** — create, view, update, and delete expense records.
- **Natural-language expense entry** — extract expense details from text using rule-based parsing and regular expressions.
- **Voice-based expense entry** — transcribe uploaded audio with the pretrained Whisper model, then pass the transcript to the expense parser.
- **Financial AI assistant** — connect to a language model through the configured API integration for finance-related questions and suggestions.
- **Budget tracking** — compare spending against a configured budget.
- **Dashboard and analytics** — review spending totals and financial activity.
- **Spending forecast** — estimate the next month's spending using a simple trend-based calculation.
- **Report exports** — export financial data to formats such as CSV, Excel, or PDF, where supported by the application.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend logic and application services |
| Flask | Web framework and HTTP routes |
| HTML, CSS, JavaScript | Web interface |
| SQLite | Persistent relational storage |
| SQL | Querying and updating expense records |
| OpenAI API / LangChain | Financial chat integration, when configured |
| Hugging Face Transformers | Loading the Whisper speech-recognition pipeline |
| OpenAI Whisper (`whisper-base`) | Audio transcription |
| PyTorch | Model execution backend |
| CSV, Excel, and PDF libraries | Financial report exports |

## Project Structure

```text
FinUP/
├── app.py                  # Flask application and routes
├── ai_parser.py            # Natural-language expense parsing
├── ai_chat.py              # Financial AI assistant integration
├── database.py             # Database connection and initialization
├── models.py               # Data models and related structures
├── expense_service.py      # Expense-related business logic
├── predictor.py             # Trend-based spending prediction
├── whisper_service.py      # Audio transcription with Whisper
├── config.py               # Application configuration
├── verify_routes.py        # Route verification utilities
├── requirements.txt        # Python dependencies
├── templates/              # HTML templates
├── static/                 # CSS, JavaScript, and other static assets
├── uploads/audio/           # Uploaded audio files (if used at runtime)
└── finance.db               # SQLite database (if present/generated)
```

The exact files and folders may vary by branch or version.

## How It Works

### 1. Text-based expense entry

A user submits a description such as:

> I spent ₹250 on lunch today.

The Flask application receives the request, sends the text to `ai_parser.py`, and uses the extracted details in the expense workflow. The parser relies primarily on rule-based logic and regular expressions; it is not a trained language model.

### 2. Saving and retrieving expenses

`expense_service.py` contains business logic for expense operations and uses database helpers to access SQLite. For example, `get_expenses(user_email)` retrieves the expenses associated with an email address and orders them by date.

The SQL query uses a parameter placeholder (`?`) to pass the email separately from the query string, which helps avoid SQL injection for that value.

### 3. Voice-based expense entry

The general audio workflow is:

1. The user uploads an audio recording.
2. The application stores the file.
3. `whisper_service.py` uses the pretrained Whisper model to transcribe the speech.
4. The transcript is passed to the expense parser.
5. The extracted details can be reviewed and saved through the expense workflow.

Whisper performs speech recognition; the expense parser extracts the financial details from the resulting text.

### 4. Spending forecast

`predictor.py` groups expenses by month and estimates the next month's total using a simple trend calculation. For example, if monthly totals are ₹5,000, ₹6,000, and ₹7,000, a straight-line trend estimates ₹8,000 for the following month.

This is a lightweight heuristic, **not a trained machine-learning forecasting model**. Results can be unreliable when spending fluctuates, dates are missing, or months are absent from the data.

## Getting Started

### Prerequisites

- Python 3.10 or another version supported by the dependencies in `requirements.txt`
- `pip`
- Git
- An OpenAI API key if you want to use the configured financial chat feature
- Sufficient disk space and memory to load the Whisper model for voice transcription

### 1. Clone the repository

```bash
git clone https://github.com/noelpn/FinUP.git
cd FinUP
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If installation fails, check the Python version and the installation instructions for any packages that require system libraries.

### 4. Configure environment variables

If the financial chat integration uses an OpenAI API key, configure it in your environment rather than hardcoding it in source code.

**Windows (PowerShell):**

```powershell
$env:OPENAI_API_KEY = "your-api-key"
```

**Linux / macOS:**

```bash
export OPENAI_API_KEY="your-api-key"
```

Replace the example value with your own key. Do not commit API keys to Git or include them in screenshots, logs, or public issue reports.

The application may use additional settings defined in `config.py`; review that file and the relevant service modules before running the project.

### 5. Start the application

Inspect `app.py` to confirm the project's entry point and then run the appropriate command. If the application defines the Flask app in `app.py`, a typical command is:

```bash
python app.py
```

Alternatively, if Flask CLI configuration is supported:

```bash
flask --app app run --debug
```

Use debug mode only for local development, never for a public production deployment. Open the local URL printed in the terminal, commonly `http://127.0.0.1:5000`.

### 6. Verify the application

- Open the dashboard in a browser.
- Add a test expense and check that it appears in the expense list.
- Test editing and deleting a test record.
- Try natural-language expense entry.
- If configured, test the financial assistant and audio transcription.
- Check the forecast and report-export workflows.
- Avoid using real financial information while testing.

## Security and Privacy

FinUP may process personal financial information and uploaded audio. Before deploying it or making the repository public:

- **Protect secrets:** load API keys from environment variables or a secret manager; never commit them.
- **Review the database:** ensure `finance.db` contains no real personal or financial data before publishing it. Add local database files to `.gitignore` when appropriate.
- **Check repository history:** removing a secret or database from the latest commit does not remove it from previous Git history.
- **Enforce authorization:** verify that every expense query and mutation checks the authenticated user's identity on the server. Do not trust a user email supplied by the client as the sole authorization check.
- **Secure sessions:** use a strong secret key and secure cookie settings in production.
- **Validate uploads:** limit file size and accepted audio formats; generate safe filenames; handle malformed files and clean up temporary uploads.
- **Protect endpoints:** use appropriate authentication, authorization, CSRF protection for cookie-based forms, rate limits, and input validation.
- **Handle errors safely:** do not expose stack traces, secrets, or sensitive financial records to users.
- **Review exports:** ensure exported reports contain only the data the requesting user is authorized to access.
- **Use HTTPS in production** and define a retention policy for uploaded audio and financial records.

This README does not constitute a security audit. Review and test the application's actual implementation before deployment.

## Current Limitations

- Natural-language expense extraction is rule-based and may misinterpret ambiguous descriptions.
- The spending forecast is a simple trend heuristic and should not be treated as financial advice.
- Speech recognition quality depends on the recording, language, model, and available hardware.
- The AI assistant depends on its configured model/API integration and may incur API costs.
- Actual functionality depends on configuration and should be verified by running the application and its tests.

## Development Ideas

Potential next steps include:

- Add automated unit and integration tests for expense parsing and database operations.
- Validate amounts, dates, categories, and payment methods before saving.
- Add user authentication and enforce per-user authorization consistently.
- Compare forecast methods using historical backtesting and error metrics.
- Improve error messages, logging, and API timeout handling.
- Add screenshots, a demo video, and a deployment guide.
- Add CI checks for formatting, linting, tests, and dependency security.

## Contributing

Contributions and suggestions are welcome. For a change:

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change and add tests where appropriate.
4. Run the relevant checks.
5. Open a pull request describing the change.

## Disclaimer

FinUP is a software project for expense organization and experimentation. Forecasts and AI-generated suggestions may be inaccurate and should not be treated as professional financial, investment, tax, or legal advice.

## Repository

[https://github.com/noelpn/FinUP](https://github.com/noelpn/FinUP)
