# Service Account 直接設定指南

如果您已經有 Google Service Account 的 JSON 金鑰檔案，可以直接設定而不需要本機安裝 rclone。

## 前提條件

✅ 已有 Google Cloud Project  
✅ 已啟用 Google Drive API  
✅ 已建立 Service Account 並下載 JSON 金鑰檔案  
✅ 已在 Google Drive 建立 `GitHub-PR-Descriptions` 資料夾  
✅ 已將資料夾分享給 Service Account 的 email（在 JSON 檔案的 `client_email` 欄位）  

## 快速設定方法

### 步驟 1: 準備 rclone 配置內容

將以下模板複製，並替換 `YOUR_SERVICE_ACCOUNT_JSON_CONTENT`：

```ini
[gdrive]
type = drive
scope = drive.file
service_account_credentials = YOUR_SERVICE_ACCOUNT_JSON_CONTENT
```

### 步驟 2: 替換 Service Account 內容

將您的 Service Account JSON 檔案內容壓縮成一行，替換上面的 `YOUR_SERVICE_ACCOUNT_JSON_CONTENT`。

例如，如果您的 JSON 檔案內容是：
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

將其壓縮成一行（移除換行和多餘空格）：
```
{"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"github-actions@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token"}
```

### 步驟 3: 最終的 rclone 配置

```ini
[gdrive]
type = drive
scope = drive.file
service_account_credentials = {"type":"service_account","project_id":"your-project",...}
```

### 步驟 4: 設定 GitHub Secret

1. 前往 GitHub repository → Settings → Secrets and variables → Actions
2. 點擊 "New repository secret"
3. Name: `RCLONE_TOKEN`
4. Value: 貼上完整的 rclone 配置內容（包含 `[gdrive]` 開頭）

## 自動化腳本

我為您建立一個 Python 腳本來自動處理這個轉換： 