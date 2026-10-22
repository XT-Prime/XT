const ADMIN_PASSWORD = "B4k9Xp2T";

const defaultCategories = ["تکنولوژی", "علمی", "آموزشی"];
let categories = JSON.parse(localStorage.getItem("categories")) || defaultCategories;

const defaultArticles = [
    {id:1, title:"آینده هوش مصنوعی در سال 2025", category:"تکنولوژی", image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", excerpt:"هوش مصنوعی چگونه زندگی ما را متحول خواهد کرد؟", content:"هوش مصنوعی پیشرفت چشمگیری داشته است...", date:"1403/02/15"},
    {id:2, title:"رازهای کهکشان راه شیری", category:"علمی", image:"https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800", excerpt:"سفری به اعماق کهکشان", content:"کهکشان راه شیری خانه میلیاردها ستاره است...", date:"1403/02/10"},
    {id:3, title:"چطور پایتون را در 30 روز یاد بگیریم؟", category:"آموزشی", image:"https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800", excerpt:"نقشه راه کامل یادگیری پایتون", content:"پایتون یکی از محبوب‌ترین زبان‌هاست...", date:"1403/02/01"},
];
let articles = JSON.parse(localStorage.getItem("articles")) || defaultArticles;
let currentCategory = "همه";

function saveToStorage(){ localStorage.setItem("articles", JSON.stringify(articles)); }
function saveCategories(){ localStorage.setItem("categories", JSON.stringify(categories)); }

// دارک مود
window.toggleDarkMode = function(){
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    document.getElementById("darkBtn").innerHTML = document.body.classList.contains("dark-mode") ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}
if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark-mode");
}

// رندر دسته بندی ها - مشکل شماره 1 حل شد
function renderCategories(){
    const container = document.getElementById("categoriesContainer");
    const select = document.getElementById("category");
    let html = `<button class="cat-btn ${currentCategory==='همه'?'active':''}" onclick="filterCategory('همه')">همه</button>`;
    categories.forEach(cat => {
        html += `<button class="cat-btn ${currentCategory===cat?'active':''}" onclick="filterCategory('${cat}')">${cat}</button>`;
    });
    container.innerHTML = html;
    select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");

    // لیست دسته بندی در پنل ادمین
    document.getElementById("categoryListAdmin").innerHTML = categories.map(c => `
        <span class="cat-admin-item">${c} <button onclick="deleteCategory('${c}')" title="حذف"><i class="fa-solid fa-xmark"></i></button></span>
    `).join("") || "<small style='color:gray'>دسته ای وجود ندارد</small>";
}
window.filterCategory = function(cat){
    currentCategory = cat;
    renderCategories();
    renderArticles();
}
window.addCategory = function(){
    const input = document.getElementById("newCategoryInput");
    const val = input.value.trim();
    if(!val) return alert("نام دسته را وارد کنید");
    if(categories.includes(val)) return alert("این دسته قبلا وجود دارد");
    categories.push(val);
    saveCategories();
    input.value = "";
    renderCategories();
    renderArticles();
}
window.deleteCategory = function(cat){
    if(!confirm(`دسته "${cat}" حذف شود؟ مقالات این دسته باقی میمانند.`)) return;
    categories = categories.filter(c => c !== cat);
    if(currentCategory === cat) currentCategory = "همه";
    saveCategories();
    renderCategories();
    renderArticles();
}

function renderArticles(){
    const grid = document.getElementById("articlesGrid");
    const searchVal = document.getElementById("searchInput").value.toLowerCase();
    let filtered = articles.filter(a => 
        (currentCategory === "همه" || a.category === currentCategory) &&
        (a.title.toLowerCase().includes(searchVal) || a.excerpt.toLowerCase().includes(searchVal))
    );
    if(filtered.length === 0){
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:gray">مقاله‌ای یافت نشد</p>`;
        return;
    }
    grid.innerHTML = filtered.map(a => `
        <div class="card article-card" onclick="openArticle(${a.id})">
            <img src="${a.image}" alt="">
            <div class="info">
                <span class="tag">${a.category}</span>
                <h3>${a.title}</h3>
                <p>${a.excerpt}</p>
                <div style="font-size:12px; color:var(--gray); margin-top:10px"><i class="fa-regular fa-calendar"></i> ${a.date}</div>
            </div>
        </div>
    `).join("");
}
window.searchArticles = function(){ renderArticles(); }
window.openArticle = function(id){
    const a = articles.find(x => x.id === id);
    document.getElementById("home-section").classList.add("hidden");
    document.getElementById("admin-section").classList.add("hidden");
    document.getElementById("single-section").classList.remove("hidden");
    document.getElementById("singleArticle").innerHTML = `<span class="tag">${a.category}</span><h1>${a.title}</h1><div style="color:var(--gray)">${a.date}</div><img src="${a.image}" style="width:100%;max-height:400px;object-fit:cover;border-radius:16px;margin:15px 0"><p style="color:var(--gray)">${a.excerpt}</p><div style="white-space:pre-line;margin-top:15px">${a.content}</div>`;
    window.scrollTo(0,0);
}
window.showHome = function(){
    document.getElementById("single-section").classList.add("hidden");
    document.getElementById("admin-section").classList.add("hidden");
    document.getElementById("home-section").classList.remove("hidden");
    renderArticles();
}
window.showAdminLogin = function(){
    document.getElementById("home-section").classList.add("hidden");
    document.getElementById("single-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    renderCategories(); renderAdminList();
}
window.login = function(){
    if(document.getElementById("adminPass").value === ADMIN_PASSWORD){
        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("loginError").textContent = "";
    } else {
        document.getElementById("loginError").textContent = "رمز اشتباه است!";
    }
}
window.logout = function(){
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
    document.getElementById("adminPass").value = "";
    showHome();
}
window.saveArticle = function(e){
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const newArticle = {
        id: id ? Number(id) : Date.now(),
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        image: document.getElementById("image").value || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        excerpt: document.getElementById("excerpt").value,
        content: document.getElementById("content").value,
        date: new Date().toLocaleDateString("fa-IR")
    };
    if(id){
        const idx = articles.findIndex(a => a.id == id);
        articles[idx] = newArticle;
    } else {
        articles.unshift(newArticle);
    }
    saveToStorage();
    e.target.reset(); document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent = "افزودن مقاله جدید";
    document.getElementById("submitBtn").textContent = "انتشار مقاله";
    document.getElementById("cancelEdit").classList.add("hidden");
    renderArticles(); renderAdminList();
    alert("ذخیره شد!");
}
function renderAdminList(){
    document.getElementById("count").textContent = articles.length;
    document.getElementById("adminList").innerHTML = articles.map(a => `
        <div class="admin-item">
            <div><strong>${a.title}</strong><br><small>${a.category} | ${a.date}</small></div>
            <div><button style="background:#ffeaa7;border:none;padding:6px 10px;border-radius:8px;cursor:pointer" onclick="editArticle(${a.id})"><i class="fa-solid fa-pen"></i></button>
            <button style="background:#fab1a0;border:none;padding:6px 10px;border-radius:8px;cursor:pointer" onclick="deleteArticle(${a.id})"><i class="fa-solid fa-trash"></i></button></div>
        </div>
    `).join("");
}
window.editArticle = function(id){
    const a = articles.find(x => x.id === id);
    document.getElementById("editId").value = a.id;
    document.getElementById("title").value = a.title;
    document.getElementById("category").value = a.category;
    document.getElementById("image").value = a.image;
    document.getElementById("excerpt").value = a.excerpt;
    document.getElementById("content").value = a.content;
    document.getElementById("formTitle").textContent = "ویرایش مقاله";
    document.getElementById("submitBtn").textContent = "ذخیره تغییرات";
    document.getElementById("cancelEdit").classList.remove("hidden");
    window.scrollTo(0,0);
}
window.cancelArticleEdit = function(){
    document.getElementById("articleForm").reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent = "افزودن مقاله جدید";
    document.getElementById("submitBtn").textContent = "انتشار مقاله";
    document.getElementById("cancelEdit").classList.add("hidden");
}
window.deleteArticle = function(id){
    if(confirm("حذف شود؟")){
        articles = articles.filter(a => a.id !== id);
        saveToStorage(); renderArticles(); renderAdminList();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("darkMode")==="true") document.getElementById("darkBtn").innerHTML = '<i class="fa-solid fa-sun"></i>';
    renderCategories(); renderArticles();
});