# Google Drive Integration 設定指南

## 步驟 1: 建立 Google Cloud Project

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 記下專案 ID

## 步驟 2: 啟用 Google Drive API

1. 在 Google Cloud Console 中，前往「API 和服務」→「程式庫」
2. 搜尋「Google Drive API」
3. 點擊並啟用此 API

## 步驟 3: 建立 Service Account

1. 前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「服務帳戶」
3. 填寫服務帳戶詳情：
   - 名稱：`github-actions-drive-uploader`
   - 說明：`用於 GitHub Actions 上傳 PR 文檔到 Google Drive`
4. 跳過角色設定（稍後會直接分享資料夾）
5. 完成建立

## 步驟 4: 建立和下載金鑰

1. 在憑證頁面找到剛建立的服務帳戶
2. 點擊服務帳戶名稱進入詳細頁面
3. 切換到「金鑰」分頁
4. 點擊「新增金鑰」→「建立新金鑰」
5. 選擇「JSON」格式
6. 下載金鑰檔案（請妥善保管！）

## 步驟 5: 建立 Google Drive 資料夾並分享

1. 在 Google Drive 中建立資料夾：`GitHub-PR-Descriptions`
2. 右鍵點擊資料夾 → 「分享」
3. 新增您的服務帳戶電子郵件（在 JSON 金鑰檔案中的 `client_email` 欄位）
4. 給予「編輯者」權限

## 步驟 6: 產生 rclone token

有兩種方法產生 rclone token：

### 方法 A: 使用本機 rclone（推薦）

```bash
# 安裝 rclone
curl https://rclone.org/install.sh | bash

# 配置 Google Drive remote
rclone config

# 選擇：
# n) New remote
# name: gdrive
# Storage: drive (Google Drive)
# client_id: (直接按 Enter，使用預設)
# client_secret: (直接按 Enter，使用預設)
# scope: drive.file
# service_account_file: /path/to/your/downloaded.json
# 其他選項保持預設

# 測試連接
rclone ls gdrive:

# 檢查配置
rclone config show gdrive
```

### 方法 B: 手動建立 token（進階）

如果您使用 Service Account，token 格式如下：

```json
{
  "access_token": "",
  "refresh_token": "",
  "token_type": "Bearer",
  "expiry": "0001-01-01T00:00:00Z",
  "service_account": "/path/to/service-account.json"
}
```

## 步驟 7: 設定 GitHub Secrets

1. 前往您的 GitHub repository
2. 點擊「Settings」→「Secrets and variables」→「Actions」
3. 點擊「New repository secret」
4. 名稱：`RCLONE_TOKEN`
5. 值：從 `rclone config show gdrive` 取得的 token 內容

## 步驟 8: 測試設定

建立測試檔案來驗證設定：

```bash
# 建立測試檔案
echo "測試上傳" > test.txt

# 上傳測試
rclone copy test.txt gdrive:GitHub-PR-Descriptions/

# 檢查是否成功
rclone ls gdrive:GitHub-PR-Descriptions/
```

## 安全注意事項

1. **金鑰安全**：
   - 下載的 JSON 金鑰檔案包含敏感資訊，請勿提交到 git
   - 定期輪換金鑰

2. **權限最小化**：
   - 服務帳戶只有特定資料夾的存取權限
   - 使用 `drive.file` scope 而非 `drive` 完整權限

3. **監控**：
   - 定期檢查 Google Cloud Console 的 API 使用量
   - 監控 Drive 資料夾的檔案變化

## 故障排除

### 常見錯誤 1: "token expired"
- 重新產生 rclone token
- 檢查服務帳戶金鑰是否有效

### 常見錯誤 2: "permission denied"
- 確認服務帳戶有資料夾的編輯權限
- 檢查資料夾名稱是否正確

### 常見錯誤 3: "API not enabled"
- 確認 Google Drive API 已啟用
- 檢查專案是否正確 