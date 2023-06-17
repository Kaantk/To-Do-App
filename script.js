const navbarMenu = document.querySelectorAll('.nav-menu');
const navbarScroll = document.querySelector('.navbar-scroll');
const taskLogin = document.querySelector('.task-login');
const btnAddTask = document.querySelector('.btn-add-task');
const displayTaskList = document.querySelector('.task-list');
const checkTask = document.querySelector('.fa-check');
const errorMessage = document.querySelector('.error-message');

const defaultTask = null;
var taskList = [];
var completedTasks = [];

clearTaskLogin();

// Sayfa yüklendiğinde input içerisini temizler.
function clearTaskLogin() {
    taskLogin.value = defaultTask;
}

// Localstorage'de taslist ve completedtask varsa onları getirir, eğer yoksa da oluşturur.
if (localStorage.getItem('taskList') && localStorage.getItem('completedTasks')) {
    taskList = JSON.parse(localStorage.getItem('taskList'));
    completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
}
else {
    localStorage.setItem('taskList', JSON.stringify(taskList));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Ekle butonuna tıklandıgında null kontrolü ve menü kontrolü yapar, şartlar uygunsa elemanı tasklist'e ekler.
// Localstroge'de kaydeder ve inputu temizler.
btnAddTask.addEventListener('click', function() {
    if (taskLogin.value == "") {
        errorMessage.innerHTML = "Lütfen geçerli bir görev giriniz !";
    }
    else if (navbarScroll.classList.contains('navbar-scroll-change')) {
        errorMessage.innerHTML = "Yapılmış görevler listesine görev eklenemez !";
    }
    else {
        errorMessage.innerHTML = "";
        taskList.push(taskLogin.value);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        createTaskList(taskList);
    }
    clearTaskLogin();
})

// Sayfa ilk yüklendiğinde taskList içerisindeki görevlerin gelmesi için çağırılmaktadır.
createTaskList(taskList);

// ilk olarak sayfadaki tüm elemanları temizler ve creatList içerisine gönderilen diziyi sayfaya yazdırır.
// Arrayname içerisinden completedTask gönderildiği takdirde ekleme butonunu kaldırarak yazdırır.
function createTaskList(createList, arrayName) {
    
    displayTaskList.innerHTML = "";
    createList.forEach(task => {
        let taskIndex = taskList.indexOf(task);
        let taskDiv = document.createElement('div');
        taskDiv.classList = 'task';

        if (arrayName == 'completedTasks') {
            taskDiv.innerHTML =
            `<div class="task">
                <div class="task-description">
                    ${task}
                </div>
                <div class="task-button">
                    <button onclick="deleteCompletedTasks(${taskIndex})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
        } else {
            taskDiv.innerHTML =
            `<div class="task">
                <div class="task-description">
                    ${task}
                </div>
                <div class="task-button">
                    <button onclick="addCompletedTasks(${taskIndex})"><i class="fa-solid fa-check"></i></button>
                    <button onclick="deleteCompletedTasks(${taskIndex})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;
        }
        displayTaskList.appendChild(taskDiv);
    });
}

// Delete butonuna tıklandıgında gelen index numarasını alır, eğer ki navbar-scroll-change varsa Yapılmış görevler'e 
// tıklandı demektir. Bu durumda completedTask den siler diğer türlü taskList'ten siler.
function deleteCompletedTasks(taskIndex) {

    const scrollControl = navbarScroll.classList.contains('navbar-scroll-change');

    if (scrollControl) {
        completedTasks.splice(taskIndex, 1);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        createTaskList(completedTasks);
    } 
    else {
        taskList.splice(taskIndex, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        createTaskList(taskList);
    }

}

// Seçilen görevin index numarasını alır, taskList'ten siler ve completedTasks içerisine ekleyip günceller.
// Daha sonra da taskList'i tekrar döndürerek sayfaya yazdırır.
function addCompletedTasks(taskIndex) {
    completedTasks.push(taskList[taskIndex]);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    taskList.splice(taskIndex, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    createTaskList(taskList);
}

// Navbar üzerindeki scroll'un kaydırılması ve hangi listenin gösterileceği işlevini görür.
navbarMenu.forEach(element => {
    element.addEventListener('click', function() {
        navbarScroll.classList.add('navbar-scroll-change');

        if (element.innerHTML == 'Yapılacaklar') {
            navbarScroll.classList.remove('navbar-scroll-change');
            createTaskList(taskList);
        }
        else {
            var arrayName = "completedTasks";
            createTaskList(completedTasks, arrayName);
        }
    })
});