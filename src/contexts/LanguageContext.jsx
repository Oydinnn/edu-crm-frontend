import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  uz: {
    // Navbar
    greeting: "Salom, {name}!",
    welcome: "EduCRM platformasiga xush kelibsiz!",
    
    // Sidebar
    main: "Asosiy",
    teachers: "O'qituvchilar",
    groups: "Guruhlar",
    students: "Talabalar",
    management: "Boshqarish",
    courses: "Kurslar",
    rooms: "Xonalar",
    staff: "Hodimlar",
    messages: "Xabar Yuborish",
    subscription: "Obuna",
    sub_expired: "Obunangiz tugagan",
    days_left: "Qolgan kunlar",
    renew_sub: "Obunani yangilash",
    sub_warning: "Obuna muddati tugashiga 5 kun qoldi",
    
    // Dashboard
    stats_groups: "Guruhlar",
    stats_courses: "Kurslar",
    stats_students: "Talabalar",
    stats_teachers: "O'qituvchilar",
    lesson_schedule: "Dars Jadvali",
    col_time: "Vaqt",
    col_classes: "Sinflar",
    col_subjects: "Fanlar",
    col_teacher: "O'qituvchi",
    col_status: "Holat",
    no_lessons: "Hozircha darslar mavjud emas",

    // Common UI
    search: "Qidirish...",
    actions: "Amallar",
    add: "Qo'shish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    save: "Saqlash",
    cancel: "Bekor qilish",
    saving: "Saqlanmoqda...",
    phone: "Telefon raqam",
    email: "Email",
    address: "Manzil",
    photo: "Surati",
    name: "Nomi",
    prev: "← Previous",
    next: "Next →",

    // Teachers Page
    teachers_title: "O'qituvchilar",
    teachers_subtitle: "O'qituvchilar ro'yxati va ma'lumotlari",
    add_teacher: "O'qituvchi qo'shish",
    edit_teacher: "O'qituvchini tahrirlash",
    teacher_fio: "O'qituvchi FIO *",
    teachers_not_found: "O'qituvchilar topilmadi",

    // Students Page
    students_title: "Talabalar",
    students_subtitle: "Talabalar ro'yxati va ma'lumotlari",
    add_student: "Talaba qo'shish",
    edit_student: "Talabani tahrirlash",
    student_fio: "Talaba FIO *",
    students_not_found: "Talabalar topilmadi",

    // Groups Page
    groups_title: "Guruhlar",
    groups_subtitle: "Guruhlar ro'yxati va ma'lumotlari",
    add_group: "Guruh qo'shish",
    edit_group: "Guruhni tahrirlash",
    group_name: "Guruh nomi *",
    groups_not_found: "Guruhlar topilmadi",

    // Teacher Panel
    teacher_groups_menu: "Guruhlar",
    teacher_groups_all: "Guruhlar",
    teacher_gathering_groups: "Yig'ilayotgan guruhlar",
    teacher_profile: "Profil",
    teacher_groups_title: "Mening guruhlarim",
    teacher_groups_subtitle: "Sizga biriktirilgan guruhlar ro'yxati",
    teacher_gathering_title: "Yig'ilayotgan guruhlar",
    teacher_gathering_subtitle: "Hali to'liq yig'ilmagan guruhlar",
    teacher_gathering_not_found: "Yig'ilayotgan guruhlar topilmadi",
    teacher_profile_subtitle: "Shaxsiy ma'lumotlaringiz"
  },
  en: {
    // Navbar
    greeting: "Hello, {name}!",
    welcome: "Welcome to EduCRM platform!",
    
    // Sidebar
    main: "Main",
    teachers: "Teachers",
    groups: "Groups",
    students: "Students",
    management: "Management",
    courses: "Courses",
    rooms: "Rooms",
    staff: "Staff",
    messages: "Send Messages",
    subscription: "Subscription",
    sub_expired: "Subscription expired",
    days_left: "Remaining days",
    renew_sub: "Renew Subscription",
    sub_warning: "5 days left until subscription ends",
    
    // Dashboard
    stats_groups: "Groups",
    stats_courses: "Courses",
    stats_students: "Students",
    stats_teachers: "Teachers",
    lesson_schedule: "Lesson Schedule",
    col_time: "Time",
    col_classes: "Classes",
    col_subjects: "Subjects",
    col_teacher: "Teacher",
    col_status: "Status",
    no_lessons: "No lessons scheduled yet",

    // Common UI
    search: "Search...",
    actions: "Actions",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    saving: "Saving...",
    phone: "Phone number",
    email: "Email",
    address: "Address",
    photo: "Photo",
    name: "Name",
    prev: "← Previous",
    next: "Next →",

    // Teachers Page
    teachers_title: "Teachers",
    teachers_subtitle: "List of teachers and their information",
    add_teacher: "Add Teacher",
    edit_teacher: "Edit Teacher",
    teacher_fio: "Teacher Full Name *",
    teachers_not_found: "Teachers not found",

    // Students Page
    students_title: "Students",
    students_subtitle: "List of students and their information",
    add_student: "Add Student",
    edit_student: "Edit Student",
    student_fio: "Student Full Name *",
    students_not_found: "Students not found",

    // Groups Page
    groups_title: "Groups",
    groups_subtitle: "List of groups and their information",
    add_group: "Add Group",
    edit_group: "Edit Group",
    group_name: "Group Name *",
    groups_not_found: "Groups not found",

    // Teacher Panel
    teacher_groups_menu: "Groups",
    teacher_groups_all: "Groups",
    teacher_gathering_groups: "Gathering groups",
    teacher_profile: "Profile",
    teacher_groups_title: "My Groups",
    teacher_groups_subtitle: "List of groups assigned to you",
    teacher_gathering_title: "Gathering Groups",
    teacher_gathering_subtitle: "Groups still being formed",
    teacher_gathering_not_found: "No gathering groups found",
    teacher_profile_subtitle: "Your personal information"
  },
  ru: {
    // Navbar
    greeting: "Здравствуйте, {name}!",
    welcome: "Добро пожаловать на платформу EduCRM!",
    
    // Sidebar
    main: "Главная",
    teachers: "Учителя",
    groups: "Группы",
    students: "Студенты",
    management: "Управление",
    courses: "Курсы",
    rooms: "Аудитории",
    staff: "Сотрудники",
    messages: "Отправить сообщение",
    subscription: "Подписка",
    sub_expired: "Подписка истекла",
    days_left: "Осталось дней",
    renew_sub: "Обновить подписку",
    sub_warning: "Осталось 5 дней до конца подписки",
    
    // Dashboard
    stats_groups: "Группы",
    stats_courses: "Курсы",
    stats_students: "Студенты",
    stats_teachers: "Учителя",
    lesson_schedule: "Расписание занятий",
    col_time: "Время",
    col_classes: "Классы",
    col_subjects: "Предметы",
    col_teacher: "Учитель",
    col_status: "Статус",
    no_lessons: "Уроков пока нет",

    // Common UI
    search: "Поиск...",
    actions: "Действия",
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отмена",
    saving: "Сохранение...",
    phone: "Номер телефона",
    email: "Электронная почта",
    address: "Адрес",
    photo: "Фотография",
    name: "Имя",
    prev: "← Предыдущий",
    next: "Следующий →",

    // Teachers Page
    teachers_title: "Учителя",
    teachers_subtitle: "Список учителей и их информация",
    add_teacher: "Добавить учителя",
    edit_teacher: "Редактировать учителя",
    teacher_fio: "ФИО учителя *",
    teachers_not_found: "Учителя не найдены",

    // Students Page
    students_title: "Студенты",
    students_subtitle: "Список студентов и их информация",
    add_student: "Добавить студента",
    edit_student: "Редактировать студента",
    student_fio: "ФИО студента *",
    students_not_found: "Студенты не найдены",

    // Groups Page
    groups_title: "Группы",
    groups_subtitle: "Список групп и их информация",
    add_group: "Добавить группу",
    edit_group: "Редактировать группу",
    group_name: "Название группы *",
    groups_not_found: "Группы не найдены",

    // Teacher Panel
    teacher_groups_menu: "Группы",
    teacher_groups_all: "Группы",
    teacher_gathering_groups: "Формирующиеся группы",
    teacher_profile: "Профиль",
    teacher_groups_title: "Мои группы",
    teacher_groups_subtitle: "Список назначенных вам групп",
    teacher_gathering_title: "Формирующиеся группы",
    teacher_gathering_subtitle: "Группы, которые ещё формируются",
    teacher_gathering_not_found: "Формирующиеся группы не найдены",
    teacher_profile_subtitle: "Ваши личные данные"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "uz";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations["uz"]?.[key] || key;
    Object.keys(params).forEach((param) => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
