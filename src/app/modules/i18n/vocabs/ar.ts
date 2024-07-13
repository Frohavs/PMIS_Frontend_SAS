// USA
export const locale = {
  lang: 'ar',
  data: {
    TRANSLATOR: {
      SELECT: 'اختر لغتك',
      SELECTION: 'اختار...'
    },
    MENU: {
      NEW: 'جديد',
      ACTIONS: 'أجراءات',
      CREATE_POST: 'إنشاء مشاركة جديدة',
      PAGES: 'الصفحات',
      FEATURES: 'سمات',
      APPS: 'تطبيقات',
      DASHBOARD: 'لوحة التحكم',
      COMPANIES: 'الشركات',
      GROUPS: 'المجموعات',
      Users_Management: 'إدارة المستخدمين',
      USERS: 'المستخدمين',
      Tracking: 'التعقب',
    },
    COMPANY: {
      ID: 'رقم',
      TITLE: 'شركة',
      Add_Company: 'إضافة شركة',
      Edit_Company: 'تعديل شركة',
      TYPE: 'النوع',
      EN_NAME: 'الأسم بالأنجليزية',
      cr_number: 'الرقم التعريفي',
      Status: 'الحالة',
      notifications: 'الأشعارات',
      Search: 'بحث عن الشركة...',
      consultant: 'إستشاري',
      contractor: 'مقاول',
      riyadh_municipality: 'أمانة الرياض',
      governmental_institution: 'مؤسسة حكومية',
    },
    GROUPS: {
      ID: 'رقم',
      TITLE: 'مجموعات',
      Add_Group: 'إضافة مجموعة',
      TYPE: 'النوع',
      Test: 'تست',
      EN_NAME: 'الأسم بالأنجليزية',
      Status: 'الحالة',
      Search: 'بحث عن المجموعة...',
    },
    Users: {
      ID: 'رقم',
      TITLE: 'المستخدمين',
      Add_Group: 'إضافة مستخدم',
      TYPE: 'النوع',
      Test: 'تست',
      EN_NAME: 'الأسم بالأنجليزية',
      Status: 'الحالة',
      Search: 'بحث عن المستخدم...',
    },
    TRACKING: {
      ID: 'رقم',
      Tracking: 'التعقب',
      full_name: 'الأسم بالكامل',
      url: 'الرابط',
      message: 'الرسالة',
      date: 'التاريخ',
      Search: 'بحث ...',
    },
    AUTH: {
      GENERAL: {
        SIGN_IN: 'تسجيل دخول',
        OR: 'أو',
        SUBMIT_BUTTON: 'إرسال',
        NO_ACCOUNT: 'ليس لديك حساب ؟',
        SIGNUP_BUTTON: 'حساب جديد',
        FORGOT_BUTTON: 'نسيت كلمة المرور',
        BACK_BUTTON: 'عودة',
        PRIVACY: 'خصوصية',
        LEGAL: 'قانوني',
        CONTACT: 'اتصال',
        CONTINUE: 'استمرار',
        NOT_MEMBER: 'لست عضوا حتى الآن ؟'

      },
      LOGIN: {
        TITLE: 'تسجيل الدخول',
        BUTTON: 'تسجيل الدخول',
      },
      FORGOT: {
        TITLE: 'نسيت كلمة المرور ؟',
        DESC: 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك',
        SUCCESS: 'تمت إعادة ضبط حسابك بنجاح.'
      },
      REGISTER: {
        TITLE: 'حساب جديد',
        DESC: 'أدخل التفاصيل الخاصة بك لإنشاء حسابك',
        SUCCESS: 'لقد تم تسجيل حسابك بنجاح.'
      },
      INPUT: {
        EMAIL: 'البريد الإلكتروني',
        FULLNAME: 'الأسم بالكامل',
        PASSWORD: 'كلمة المرور',
        CONFIRM_PASSWORD: 'تأكيد كلمة المرور',
        USERNAME: 'أسم المستخدم'
      },
      VALIDATION: {
        INVALID: '{{name}} غير صالح',
        REQUIRED: '{{name}} مطلوب',
        MIN_LENGTH: '{{name}} الحد الأدنى هو {{min}}',
        AGREEMENT_REQUIRED: 'قبول الشروط والأحكام مطلوب',
        NOT_FOUND: 'لم يتم العثور على {{name}}',
        INVALID_LOGIN: 'تفاصيل تسجيل الدخول غير صحيحة',
        REQUIRED_FIELD: 'حقل إلزامي',
        MIN_LENGTH_FIELD: 'الحد الأدنى:',
        MAX_LENGTH_FIELD: 'الحد الأقصي:',
        INVALID_FIELD: 'الحقل غير صالح',
      }
    },
    ECOMMERCE: {
      COMMON: {
        SELECTED_RECORDS_COUNT: 'عدد السجلات المحددة: ',
        ALL: 'الكل',
        SUSPENDED: 'معلق',
        ACTIVE: 'نشط',
        FILTER: 'تصفية',
        BY_STATUS: 'حسب الحالة',
        BY_TYPE: 'حسب النوع',
        BUSINESS: 'عمل',
        INDIVIDUAL: 'فردي',
        SEARCH: 'بحث',
        IN_ALL_FIELDS: 'في جميع الحقول',
        BACK: 'رجوع'
      },
      ECOMMERCE: 'التجارة الإلكترونية',
      CUSTOMERS: {
        CUSTOMERS: 'العملاء',
        CUSTOMERS_LIST: 'قائمة العملاء',
        NEW_CUSTOMER: 'عميل جديد',
        DELETE_CUSTOMER_SIMPLE: {
          TITLE: 'حذف عميل',
          DESCRIPTION: 'هل أنت متأكد من حذف هذا العميل نهائيًا؟',
          WAIT_DESCRIPTION: 'جاري حذف العميل...',
          MESSAGE: 'تم حذ العميل بنجاح'
        },
        DELETE_CUSTOMER_MULTY: {
          TITLE: 'حذف العملاء',
          DESCRIPTION: 'هل أنت متأكد من حذف العملاء المحددين نهائيًا؟',
          WAIT_DESCRIPTION: 'جاري حذف العملاء...',
          MESSAGE: 'تم حذف العملاء المحددين'
        },
        UPDATE_STATUS: {
          TITLE: 'تم تحديث الحالة لعملاء محددين',
          MESSAGE: 'تم تحديث حالة العملاء المحددين بنجاح'
        },
        EDIT: {
          UPDATE_MESSAGE: 'تم تحديث العميل',
          ADD_MESSAGE: 'تم إنشاء العميل'
        }
      }
    }
  }
};
