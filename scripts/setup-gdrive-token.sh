#!/bin/bash

# Google Drive Token 設定腳本
# 用於產生 GitHub Actions 需要的 RCLONE_TOKEN

set -e

echo "🚀 Google Drive Integration 設定腳本"
echo "======================================"

# 檢查是否安裝 rclone
if ! command -v rclone &> /dev/null; then
    echo "📦 安裝 rclone..."
    curl https://rclone.org/install.sh | bash
fi

echo "📝 請確保您已完成以下步驟："
echo "1. ✅ 在 Google Cloud Console 建立專案並啟用 Drive API"
echo "2. ✅ 建立 Service Account 並下載 JSON 金鑰檔案"
echo "3. ✅ 在 Google Drive 建立 'GitHub-PR-Descriptions' 資料夾"
echo "4. ✅ 將資料夾分享給服務帳戶電子郵件"
echo ""

read -p "請輸入 Service Account JSON 檔案的完整路徑: " SERVICE_ACCOUNT_FILE

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ 找不到檔案: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

echo "📧 從 JSON 檔案讀取服務帳戶資訊..."
SERVICE_EMAIL=$(cat "$SERVICE_ACCOUNT_FILE" | grep -o '"client_email": *"[^"]*"' | cut -d'"' -f4)
echo "   服務帳戶電子郵件: $SERVICE_EMAIL"

echo ""
echo "🔧 配置 rclone..."

# 建立 rclone 配置
mkdir -p ~/.config/rclone

cat > ~/.config/rclone/rclone.conf << EOF
[gdrive]
type = drive
scope = drive.file
service_account_file = $SERVICE_ACCOUNT_FILE
EOF

echo "✅ rclone 配置已建立"

echo ""
echo "🧪 測試連接..."

if rclone ls gdrive: > /dev/null 2>&1; then
    echo "✅ Google Drive 連接成功！"
else
    echo "❌ Google Drive 連接失敗"
    echo "請檢查："
    echo "- Service Account JSON 檔案是否正確"
    echo "- Google Drive API 是否已啟用"
    echo "- 是否已分享資料夾給服務帳戶"
    exit 1
fi

echo ""
echo "📂 檢查目標資料夾..."

if rclone ls gdrive:GitHub-PR-Descriptions > /dev/null 2>&1; then
    echo "✅ 找到 GitHub-PR-Descriptions 資料夾"
else
    echo "❌ 找不到 GitHub-PR-Descriptions 資料夾"
    echo "請確保："
    echo "1. 在 Google Drive 建立名為 'GitHub-PR-Descriptions' 的資料夾"
    echo "2. 將資料夾分享給服務帳戶: $SERVICE_EMAIL"
    echo "3. 給予編輯者權限"
    exit 1
fi

echo ""
echo "🔑 產生 GitHub Secret..."

# 顯示需要設定的 token
echo "請將以下內容設定為 GitHub Secret 'RCLONE_TOKEN':"
echo ""
echo "=================================================="
rclone config show gdrive | grep -A 10 -B 2 '\[gdrive\]'
echo "=================================================="

echo ""
echo "📋 GitHub 設定步驟："
echo "1. 前往 GitHub repository → Settings → Secrets and variables → Actions"
echo "2. 點擊 'New repository secret'"
echo "3. Name: RCLONE_TOKEN"
echo "4. Value: 複製上面 [gdrive] 區塊的完整內容"
echo ""

echo "🎉 設定完成！"
echo ""
echo "💡 提示："
echo "- 如需重新設定，執行: rclone config"
echo "- 測試上傳: rclone copy test.txt gdrive:GitHub-PR-Descriptions/"
echo "- 查看檔案: rclone ls gdrive:GitHub-PR-Descriptions/" 