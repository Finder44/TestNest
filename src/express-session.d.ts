import 'express-session'

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

// расширение интерфейса сешн дата  из express-session и указваем необяз поле юзерайли
//нужно чтобы получать из сессии наш юзерайди и потом по нему выполнять полныый поиск пользователя  (метод findById)