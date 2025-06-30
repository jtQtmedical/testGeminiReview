#!/usr/bin/env python3
"""
Service Account JSON 轉 rclone 配置工具
自動將 Google Service Account JSON 轉換為 GitHub Actions 可用的 RCLONE_TOKEN
"""

import json
import sys
import os
from pathlib import Path

def main():
    print("🔑 Service Account JSON 轉 rclone 配置工具")
    print("=" * 50)
    
    # 取得 JSON 檔案路徑
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    else:
        json_file = input("請輸入 Service Account JSON 檔案路徑: ").strip()
    
    # 檢查檔案是否存在
    if not os.path.exists(json_file):
        print(f"❌ 找不到檔案: {json_file}")
        sys.exit(1)
    
    try:
        # 讀取並驗證 JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            service_account_data = json.load(f)
        
        # 檢查必要欄位
        required_fields = ['type', 'project_id', 'private_key', 'client_email']
        missing_fields = [field for field in required_fields if field not in service_account_data]
        
        if missing_fields:
            print(f"❌ JSON 檔案缺少必要欄位: {', '.join(missing_fields)}")
            sys.exit(1)
        
        if service_account_data.get('type') != 'service_account':
            print("❌ 這不是一個有效的 Service Account JSON 檔案")
            sys.exit(1)
        
        print(f"✅ JSON 檔案驗證成功")
        print(f"📧 Service Account Email: {service_account_data['client_email']}")
        print(f"🏗️  Project ID: {service_account_data['project_id']}")
        
        # 壓縮 JSON（移除空格和換行）
        compressed_json = json.dumps(service_account_data, separators=(',', ':'))
        
        # 產生 rclone 配置
        rclone_config = f"""[gdrive]
type = drive
scope = drive.file
service_account_credentials = {compressed_json}"""
        
        print("\n" + "=" * 50)
        print("🎯 GitHub Secret 設定")
        print("=" * 50)
        print("1. 前往 GitHub repository → Settings → Secrets and variables → Actions")
        print("2. 點擊 'New repository secret'")
        print("3. Name: RCLONE_TOKEN")
        print("4. Value: 複製以下完整內容")
        print("\n" + "-" * 50)
        print("RCLONE_TOKEN 內容:")
        print("-" * 50)
        print(rclone_config)
        print("-" * 50)
        
        # 儲存到檔案（可選）
        output_file = "rclone-config.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(rclone_config)
        
        print(f"\n💾 配置已儲存到: {output_file}")
        print("\n⚠️  安全提醒:")
        print("- 請立即刪除此檔案，避免洩露敏感資訊")
        print("- 確保 Service Account JSON 檔案安全儲存")
        print("- 定期輪換 Service Account 金鑰")
        
        print("\n✅ 設定完成！")
        print("\n🧪 測試步驟:")
        print("1. 在 Google Drive 建立 'GitHub-PR-Descriptions' 資料夾")
        print(f"2. 將資料夾分享給: {service_account_data['client_email']}")
        print("3. 給予編輯者權限")
        print("4. 建立 PR 測試自動上傳功能")
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 格式錯誤: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 處理失敗: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 