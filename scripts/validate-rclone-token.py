#!/usr/bin/env python3
"""
RCLONE_TOKEN 驗證工具
檢查 GitHub Secret 中的 RCLONE_TOKEN 格式是否正確
"""

import sys
import re

def validate_rclone_token(token_content):
    """驗證 rclone token 的格式"""
    errors = []
    warnings = []
    
    # 檢查是否包含 [gdrive] section
    if not re.search(r'\[gdrive\]', token_content):
        errors.append("❌ 缺少 [gdrive] section header")
    
    # 檢查必要的欄位
    required_fields = [
        'type = drive',
        'scope = drive.file',
        'service_account_credentials'
    ]
    
    for field in required_fields:
        if field not in token_content:
            errors.append(f"❌ 缺少必要欄位: {field}")
    
    # 檢查 service_account_credentials 格式
    if 'service_account_credentials' in token_content:
        # 提取 JSON 部分
        json_match = re.search(r'service_account_credentials = (.+)', token_content)
        if json_match:
            json_content = json_match.group(1)
            
            # 檢查是否包含必要的 Service Account 欄位
            sa_fields = ['type', 'project_id', 'private_key', 'client_email']
            for field in sa_fields:
                if f'"{field}"' not in json_content:
                    errors.append(f"❌ Service Account JSON 缺少欄位: {field}")
            
            # 檢查是否為 service_account 類型
            if '"type":"service_account"' not in json_content:
                errors.append("❌ Service Account type 不正確")
        else:
            errors.append("❌ service_account_credentials 格式不正確")
    
    # 檢查是否有多餘的空行或格式問題
    lines = token_content.strip().split('\n')
    if len(lines) < 3:
        warnings.append("⚠️ 配置內容似乎太短")
    
    return errors, warnings

def main():
    print("🔍 RCLONE_TOKEN 驗證工具")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        # 從檔案讀取
        try:
            with open(sys.argv[1], 'r', encoding='utf-8') as f:
                token_content = f.read()
            print(f"📄 從檔案讀取: {sys.argv[1]}")
        except FileNotFoundError:
            print(f"❌ 找不到檔案: {sys.argv[1]}")
            sys.exit(1)
    else:
        # 從標準輸入讀取
        print("📝 請貼上您的 RCLONE_TOKEN 內容，然後按 Ctrl+D (Linux/Mac) 或 Ctrl+Z (Windows):")
        token_content = sys.stdin.read()
    
    if not token_content.strip():
        print("❌ 沒有提供任何內容")
        sys.exit(1)
    
    print("\n🔍 分析中...")
    errors, warnings = validate_rclone_token(token_content)
    
    print("\n" + "=" * 50)
    print("📊 驗證結果")
    print("=" * 50)
    
    if not errors and not warnings:
        print("✅ RCLONE_TOKEN 格式看起來正確！")
        print("\n📋 檢測到的配置:")
        
        # 顯示基本資訊（隱藏敏感資料）
        if '[gdrive]' in token_content:
            print("- ✅ [gdrive] section")
        if 'type = drive' in token_content:
            print("- ✅ Google Drive 類型")
        if 'scope = drive.file' in token_content:
            print("- ✅ 檔案存取權限")
        if 'service_account_credentials' in token_content:
            print("- ✅ Service Account 認證")
            
            # 嘗試提取 project_id 和 client_email
            import json
            try:
                json_match = re.search(r'service_account_credentials = (.+)', token_content)
                if json_match:
                    sa_json = json.loads(json_match.group(1))
                    if 'project_id' in sa_json:
                        print(f"- 📁 Project ID: {sa_json['project_id']}")
                    if 'client_email' in sa_json:
                        print(f"- 📧 Service Account: {sa_json['client_email']}")
            except:
                pass
    
    if warnings:
        print("\n⚠️ 警告:")
        for warning in warnings:
            print(f"  {warning}")
    
    if errors:
        print("\n❌ 錯誤:")
        for error in errors:
            print(f"  {error}")
        
        print("\n💡 修復建議:")
        print("1. 確保使用 scripts/generate-rclone-token.py 產生 token")
        print("2. 檢查 Service Account JSON 檔案是否完整")
        print("3. 確保格式為:")
        print("""
   [gdrive]
   type = drive
   scope = drive.file
   service_account_credentials = {"type":"service_account",...}
   """)
        
        sys.exit(1)
    
    print("\n🚀 下一步:")
    print("1. 將此內容設定為 GitHub Secret 'RCLONE_TOKEN'")
    print("2. 確保 Google Drive 資料夾已分享給 Service Account")
    print("3. 測試 GitHub Actions workflow")

if __name__ == "__main__":
    main() 