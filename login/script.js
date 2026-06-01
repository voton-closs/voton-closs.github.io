// ⚠️ あなたのSupabaseの情報を貼り付けてください
const SUPABASE_URL = "https://buyvsppegdtlqtmtpyhi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vRtvGddqMZgGUR3Qs-F3AA_w0ruclrH";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authCard = document.getElementById('auth-card');
const authContent = document.getElementById('auth-content');

// 現在のモード（'login' または 'register'）
let currentMode = 'login';

// 画面の表示をアニメーション付きで切り替える関数
function renderForm(mode) {
    currentMode = mode;
    
    // 一度ふわっと消すアニメーションを適用
    authContent.classList.add('fade-out');
    
    // アニメーションが終わるのを待ってから中身を書き換える（シームレス化）
    setTimeout(() => {
        authContent.classList.remove('fade-out');
        
        if (mode === 'login') {
            authContent.innerHTML = `
                <h2>おかえりなさい！</h2>
                <p class="subtitle">Voton Closs にログインします</p>
                <form id="auth-form">
                    <div class="form-group">
                        <label>メールアドレス</label>
                        <input type="email" id="email" required placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label>パスワード</label>
                        <input type="password" id="password" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="submit-btn">ログイン</button>
                </form>
                <div class="switch-area">
                    アカウントをお持ちでないですか？<span class="switch-btn" id="to-register">新規登録</span>
                </div>
            `;
        } else {
            authContent.innerHTML = `
                <h2>アカウント作成</h2>
                <p class="subtitle">仲間だけの特別なチャットを始めよう</p>
                <form id="auth-form">
                    <div class="form-group">
                        <label>メールアドレス</label>
                        <input type="email" id="email" required placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label>パスワード（6文字以上）</label>
                        <input type="password" id="password" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="submit-btn">アカウントを作成</button>
                </form>
                <div class="switch-area">
                    すでにアカウントをお持ちですか？<span class="switch-btn" id="to-login">ログイン</span>
                </div>
            `;
        }
        
        // 新しいフォームにフェードインアニメーションを適用
        authContent.classList.add('fade-in');
        setTimeout(() => authContent.classList.remove('fade-in'), 400);

        // イベントリスナーの再設定
        setupEventListeners();
    }, 300);
}

// フォーム内のボタンや送信処理のイベントを設定する関数
function setupEventListeners() {
    const form = document.getElementById('auth-form');
    const toRegister = document.getElementById('to-register');
    const toLogin = document.getElementById('to-login');

    // 画面切り替えのリンクが押されたとき
    if (toRegister) {
        toRegister.addEventListener('click', () => renderForm('register'));
    }
    if (toLogin) {
        toLogin.addEventListener('click', () => renderForm('login'));
    }

    // フォームが送信（ボタンクリック or Enter）されたとき
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // ページリロードを防ぐ
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (currentMode === 'register') {
            // 【新規登録処理】
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                alert("登録エラー: " + error.message);
            } else {
                alert("アカウントを作成しました！自動でログインします。");
                // 登録成功したらそのままチャット画面へ遷移
                window.location.href = "../chat/index.html";
            }
        } else {
            // 【ログイン処理】
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert("ログインエラー: " + error.message);
            } else {
                // ログイン成功したらチャット画面へ遷移
                window.location.href = "../chat/index.html";
            }
        }
    });
}

// 最初にページを開いたときはログイン画面を表示
renderForm('login');
