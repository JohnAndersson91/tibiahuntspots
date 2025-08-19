let spots = [];
let currentSection = 'All';
let sortState = {level:null, exp:null, profit:null};
const PASSWORD = "willchange321";

const tbody = document.getElementById("spotsBody");

function renderTable() {
  tbody.innerHTML = "";
  spots.forEach(s => {
    if(currentSection !== 'All' && s.section !== currentSection) return;

    const tr = document.createElement("tr");
    const imagesHTML = (s.images || []).map(i => `<img src="${i}" class="thumb" onclick="showImage('${i}')">`).join("");
    tr.innerHTML = `
      <td>${s.spot}</td>
      <td>${s.level}</td>
      <td>${s.exp}</td>
      <td>${s.profit}</td>
      <td>${imagesHTML}</td>
    `;
    tbody.appendChild(tr);
  });
}

function showImage(src) {
  const modal = document.getElementById("imageModal");
  document.getElementById("modalImg").src = src;
  modal.style.display = "flex";
}

document.getElementById("imageModal").onclick = function(){ this.style.display="none"; }

function sortTable(key){
  if(sortState[key] === null) sortState[key] = true;
  else sortState[key] = !sortState[key];

  spots.sort((a,b)=> sortState[key] ? a[key]-b[key] : b[key]-a[key]);

  ['level','exp','profit'].forEach(h=>{
    const arrowEl = document.querySelector("#"+h+"Header .arrow");
    arrowEl.textContent = "";
    if(h===key) arrowEl.textContent = sortState[key] ? "↑":"↓";
  });

  renderTable();
}

['level','exp','profit'].forEach(k=>document.getElementById(k+'Header').onclick=()=>sortTable(k));

function checkPassword() {
  if(document.getElementById("password").value === PASSWORD){
    document.getElementById("formDiv").style.display = "block";
    document.getElementById("loginDiv").style.display = "none";
  } else alert("Incorrect password");
}

document.getElementById("images").addEventListener("change", function(){
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = "";
  Array.from(this.files).forEach(file=>{
    const reader = new FileReader();
    reader.onload = function(e){
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    }
    reader.readAsDataURL(file);
  });
});

document.getElementById("addSpotForm").addEventListener("submit", function(e){
  e.preventDefault();
  const files = document.getElementById("images").files;
  const imagesArray = Array.from(files).map(f => URL.createObjectURL(f));

  const newSpot = {
    spot: document.getElementById("spotName").value,
    section: document.getElementById("sectionSelect").value,
    level: Number(document.getElementById("level").value),
    exp: Number(document.getElementById("exp").value),
    profit: Number(document.getElementById("profit").value),
    images: imagesArray
  };

  spots.push(newSpot);
  renderTable();
  this.reset();
  document.getElementById("imagePreview").innerHTML = "";
});

// Section filter
document.getElementById("sectionSelector").addEventListener("change", function(){
  currentSection = this.value;
  renderTable();
});

renderTable();
