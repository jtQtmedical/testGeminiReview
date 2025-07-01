// 前端 JavaScript 功能

// 格式化日期的輔助函數
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 刪除待辦事項
async function deleteTodo(id) {
    if (!confirm('確定要刪除這個待辦事項嗎？')) {
        return;
    }

    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // 重新載入頁面以更新列表
            window.location.reload();
        } else {
            alert('刪除失敗，請稍後再試');
        }
    } catch (error) {
        console.error('刪除錯誤:', error);
        alert('刪除失敗，請稍後再試');
    }
}

// 完成待辦事項
async function completeTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        });

        if (response.ok) {
            // 重新載入頁面以更新列表
            window.location.reload();
        } else {
            alert('更新失敗，請稍後再試');
        }
    } catch (error) {
        console.error('更新錯誤:', error);
        alert('更新失敗，請稍後再試');
    }
}

// 處理表單提交（支援 PUT 請求）
function handleSubmit(event, method) {
    if (method === 'PUT') {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // 處理 checkbox
        if (!formData.has('completed')) {
            formData.append('completed', 'false');
        }

        // 轉換為 JSON
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'completed') {
                data[key] = value === 'true';
            } else {
                data[key] = value;
            }
        }

        // 發送 PUT 請求
        fetch(form.action, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/todos';
            } else {
                alert('更新失敗，請稍後再試');
            }
        })
        .catch(error => {
            console.error('更新錯誤:', error);
            alert('更新失敗，請稍後再試');
        });
    }
    // 對於 POST 請求，讓表單正常提交
}

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新所有日期顯示
    document.querySelectorAll('[data-date]').forEach(element => {
        const dateString = element.getAttribute('data-date');
        element.textContent = formatDate(dateString);
    });

    // 為按鈕添加載入狀態
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>處理中...';
            this.disabled = true;
            
            // 如果 3 秒後還沒有響應，恢復按鈕狀態
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 3000);
        });
    });

    // 添加鍵盤快速鍵支援
    document.addEventListener('keydown', function(event) {
        // Ctrl + N 新增待辦事項
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            window.location.href = '/todos/new';
        }
        
        // Escape 鍵返回列表
        if (event.key === 'Escape') {
            if (window.location.pathname !== '/todos') {
                window.location.href = '/todos';
            }
        }
    });
}); 