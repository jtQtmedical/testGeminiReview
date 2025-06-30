#!/usr/bin/env python3
"""
RCLONE_TOKEN 除錯工具
幫助診斷和修復 RCLONE_TOKEN 格式問題
"""

import json
import re
import sys

def debug_rclone_token():
    print("🔧 RCLONE_TOKEN 除錯工具")
    print("=" * 50)
    print("請貼上您目前的 RCLONE_TOKEN 內容，然後按 Enter 兩次:")
    
    lines = []
    while True:
        try:
            line = input()
            if line == "" and lines:
                break
            lines.append(line)
        except EOFError:
            break
    
    token_content = "\n".join(lines)
    
    if not token_content.strip():
        print("❌ 沒有提供任何內容")
        return
    
    print("\n🔍 分析 RCLONE_TOKEN...")
    print("=" * 50)
    
    # 檢查基本結構
    if not re.search(r'\[gdrive\]', token_content):
        print("❌ 缺少 [gdrive] section")
        return
    
    # 提取 service_account_credentials
    match = re.search(r'service_account_credentials\s*=\s*(.+)', token_content)
    if not match:
        print("❌ 找不到 service_account_credentials")
        return
    
    json_content = match.group(1).strip()
    print(f"📋 找到 JSON 內容 ({len(json_content)} 字元)")
    
    # 顯示 JSON 的前後字元來診斷問題
    print(f"🔍 JSON 開始字元: {repr(json_content[:20])}")
    print(f"🔍 JSON 結束字元: {repr(json_content[-20:])}")
    
    # 嘗試解析 JSON
    try:
        service_account = json.loads(json_content)
        print("✅ JSON 解析成功!")
        
        # 檢查必要欄位
        required_fields = ['type', 'project_id', 'private_key', 'client_email']
        for field in required_fields:
            if field in service_account:
                print(f"✅ {field}: {service_account[field][:50] if len(str(service_account[field])) > 50 else service_account[field]}")
            else:
                print(f"❌ 缺少 {field}")
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析失敗: {e}")
        print(f"錯誤位置: 第 {e.lineno} 行, 第 {e.colno} 欄")
        
        # 嘗試找出問題
        print("\n🔧 診斷和修復建議:")
        
        # 檢查常見問題
        if json_content.startswith('t'):
            print("- 看起來 JSON 前面有多餘的文字")
        
        if not json_content.startswith('{'):
            print("- JSON 應該以 '{' 開始")
            print(f"- 但您的開始是: {repr(json_content[:10])}")
        
        if not json_content.endswith('}'):
            print("- JSON 應該以 '}' 結束")
            print(f"- 但您的結束是: {repr(json_content[-10:])}")
        
        # 嘗試找到 JSON 的真正開始
        start_idx = json_content.find('{')
        end_idx = json_content.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            clean_json = json_content[start_idx:end_idx+1]
            print(f"\n💡 嘗試清理後的 JSON ({len(clean_json)} 字元):")
            print(f"開始: {repr(clean_json[:20])}")
            print(f"結束: {repr(clean_json[-20:])}")
            
            try:
                cleaned_service_account = json.loads(clean_json)
                print("✅ 清理後的 JSON 可以解析!")
                
                # 重新產生 rclone 配置
                print("\n🔧 修復後的 RCLONE_TOKEN:")
                print("-" * 50)
                fixed_config = f"""[gdrive]
type = drive
scope = drive.file
service_account_credentials = {json.dumps(cleaned_service_account, separators=(',', ':'))}"""
                print(fixed_config)
                print("-" * 50)
                print("請使用上面的內容重新設定 RCLONE_TOKEN")
                
            except json.JSONDecodeError as e2:
                print(f"❌ 清理後仍無法解析: {e2}")
    
    print("\n💡 一般修復步驟:")
    print("1. 重新運行 scripts/generate-rclone-token.py")
    print("2. 確保複製完整的輸出內容")
    print("3. 檢查沒有多餘的空行或文字")
    print("4. 重新設定 GitHub Secret")

if __name__ == "__main__":
    debug_rclone_token() 