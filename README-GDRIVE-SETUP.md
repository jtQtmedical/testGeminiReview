# Google Drive PR 描述自動保存設定

這個功能會自動將 Pull Request 的描述保存到 Google Drive，方便進行 PR 管理和文檔歸檔。

## 🚀 快速設定（已有 Service Account）

如果您已經有 Google Service Account JSON 檔案，可以使用我們的自動化工具：

```bash
# 使用 Python 腳本自動轉換
python3 scripts/generate-rclone-token.py /path/to/your/service-account.json
```

腳本會輸出您需要設定到 GitHub Secrets 的 `RCLONE_TOKEN` 內容。

## 📋 設定步驟總覽

### 1. Google Cloud 設定
- ✅ 建立 Google Cloud Project
- ✅ 啟用 Google Drive API  
- ✅ 建立 Service Account
- ✅ 下載 JSON 金鑰檔案

### 2. Google Drive 設定
- ✅ 建立 `GitHub-PR-Descriptions` 資料夾
- ✅ 分享資料夾給 Service Account email
- ✅ 給予編輯者權限

### 3. GitHub 設定
- ✅ 設定 `RCLONE_TOKEN` Secret
- ✅ 啟用 `.github/workflows/save-pr-to-gdrive.yml`

## 🔧 工具說明

- **完整設定指南**: `docs/setup-google-drive-integration.md`
- **Service Account 快速設定**: `docs/service-account-direct-setup.md`
- **自動轉換工具**: `scripts/generate-rclone-token.py`
- **手動設定腳本**: `scripts/setup-gdrive-token.sh`

## 🧪 測試

設定完成後，建立任何 PR 都會自動：
1. 讀取 PR 標題和描述
2. 產生對應的 Markdown 檔案
3. 上傳到 Google Drive 的 `GitHub-PR-Descriptions` 資料夾

檔案命名格式：`{branch-name}.md`

## 🔒 安全注意事項

- Service Account JSON 檔案包含敏感資訊，請勿提交到 git
- 定期輪換 Service Account 金鑰
- 只給予必要的最小權限（drive.file scope）

## 🛠️ 故障排除

如果上傳失敗，請檢查：
1. Service Account email 是否有資料夾編輯權限
2. Google Drive API 是否已啟用
3. RCLONE_TOKEN 格式是否正確
4. 資料夾名稱是否為 `GitHub-PR-Descriptions` 