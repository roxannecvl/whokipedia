<p align="center">
  <a href="https://whokipedia.com">
    <img src="https://github.com/roxannecvl/whokipedia/assets/125833841/7c6187cd-d6ec-4b97-8928-ae01c4b08cc6" alt="image" width="300">
  </a>
</p>


#### Test your knowledge of the who's who in [Whokipedia](https://whokipedia.com/), where each clue leads you closer to uncovering the celebrity behind the blur !

### Description 
Our web app is a game which takes its root in the famous *Guess Who ?*, and is inspired from the [wikipedia](https://www.wikipedia.org/) interface. As a player, you will start with a **wikipedia-like page** with some basic information about a **mysterious celebrity**. Your goal is to try to guess the celebrity, using **as few hints as possible**. Hints are parts of the wikipedia interface, that you unlock **after each unsuccessful guess** or upon pressing a button on the interface. The game is over when you **finally manage to guess the celebrity**, or when there are **no more hints available**. The less hints you needed, the better your rank ! 

There are two modes, **daily challenge** and **solo**. In solo mode, you play for yourself **as many times** as you want. The daily challenge, on its side, takes its inspiration from [wordle](https://www.nytimes.com/games/wordle/index.html). The goal stays the same but there is only **one celebrity** to guess **each day**. It also features a leaderboard to compare to other players, which means you must be authenticated to participate.

After each celebrity reveal, a link to the **original** wikipedia page of the celebrity will appear, inviting you to learn more about him/her if your curiosity has been spiked. If you are logged in, you can also browse through statistics that track your performance through the daily challenges your participate in.

### Project setup
The website is live and hosted at [whokipedia.com](https://whokipedia.com).
You can also fork this repository and follow next instructions to get a local development server. We assume your working directory is the project dir, under `whokipedia/`.
+ `npm install`
+ `npm run dev` 

### Roadmap
Although our project is finished and includes all the features we originally wanted, we have plenty of ideas for improvements going forward, summarized here. Feel free to create new issues with the `Project v2` milestone for features you would like to appear !

- [ ] Improved [infobox parser](https://github.com/roxannecvl/whokipedia/issues/11)
- [ ] Support for [other langages](https://github.com/roxannecvl/whokipedia/issues/175)
- [ ] Extension of stats to [solo mode](https://github.com/roxannecvl/whokipedia/issues/173)
- [ ] [Modes](https://github.com/roxannecvl/whokipedia/issues/174) to restrict celebrities to a given field, era, etc.
- [ ] Additional [sign-in methods](https://github.com/roxannecvl/whokipedia/issues/171)

and more...


### Tools
Our project is written in [`TypeScript`](https://www.typescriptlang.org/) and uses frontend framework [`Vue`](https://vuejs.org/). Here is a presentation of major tools we use.

+ **`Nuxt`** - [`Nuxt`](https://nuxt.com/) is a framework built on top of `Vue` that provides a higher-level structure for building universal `Vue` applications. We primarily use it because of its SSR (Server-Side Rendering) capabilities. We also use [`Nuxt UI`](https://ui.nuxt.com/), which is a library of ready-to-use and customizable components that appear everywhere in our app.

+ **`Firebase`** - [`Firebase`](https://firebase.google.com/) is a comprehensive platform provided by Google for building web and mobile applications. We use its real-time database and authentication functions. We use [`VueFire`](https://vuefire.vuejs.org/) to get official `Firebase` bindings for `Vue` and even `Nuxt`.

+ **`Tailwind CSS`** - [`Tailwind CSS`](https://tailwindcss.com/) is a utility-first CSS framework that provides low-level utility classes for building custom designs without having to write custom CSS. It provides us light/dark modes and easy layout classes to apply to our templates in `*.vue` files.

+ **`Chart.js`** - [`Chart.js`](https://www.chartjs.org/) is a JS/TS library for creating responsive and interactive charts and graphs. We use it to display statistics.

+ **`Fuse.js`** - [`Fuse.js`](https://www.fusejs.io/) is a lightweight fuzzy-search JS/TS library that provides fast and efficient search functionality for arrays of objects. We use it to get celebrity suggestions in our search field.

+ **`WikiMedia API`** - `WikiMedia` provides an [API](https://www.mediawiki.org/wiki/API:Main_page) to retrieve data for celebrities from Wikipedia. It is thanks to this API we can fetch all data and hints we need to make this game live !

### 3rd-party components
Our web app uses many components from [`Nuxt UI`](https://ui.nuxt.com/). Here is a non-exhaustive list.
+ [UCard](https://ui.nuxt.com/components/card) in main layout (`app.vue`), sidebar game info (`SidebarView.vue`), game infobox (`InfoboxView.vue`), many forms (`LoginSignupView`, `LoginView`, `SignupView`, `ResetPasswordView`, ...)
+ [UTable](https://ui.nuxt.com/components/table) in leaderboard (`LeaderboardView.vue`)
+ [UProgress](https://ui.nuxt.com/components/progress) in sidebar for remaining hints (`SidebarView.vue`)
+ [UForm](https://ui.nuxt.com/components/form) and [UFormGroup](https://ui.nuxt.com/components/form-group) for every form (`LoginView`, `SignupView`, `ResetPasswordView`, `UserManagementView`, ...)
+ [UModal](https://ui.nuxt.com/components/modal) for modals (`LoginSignupView`, `UserManagementView`, `AccountView`, `LeaderboardView`, etc.)
+ [UButton](https://ui.nuxt.com/components/button), [UIcon](https://ui.nuxt.com/components/icon), ... everywhere

We also use [`Bar`](https://www.chartjs.org/docs/latest/charts/bar.html) and [`Line`](https://www.chartjs.org/docs/latest/charts/line.html) components from [`ChartJS`](https://www.chartjs.org/)  for charts in statistics display.

### File structure 
```
whokipedia/                                               
├── README.md                        
├── api/                             
│   ├── Parsing.ts                   # Parse data from API in useful hints
│   └── WikipediaSource.ts           # Fetch data from WikiMedia API
├── app.config.ts                    
├── app.vue                          # Main layout for HeaderPresenter and NuxtPage (pages below)
├── model/                           
│   ├── CelebrityList.ts             # List of playable celebrities and functions to get suggestions in search bar
│   ├── GameModel.ts                 # Application state for current game (pinia store)
│   ├── Hint.ts                      # Abstraction of a game hint from parsed data
│   ├── UserModel.ts                 # Application state for current user (pinia store)
├── nuxt.config.ts                   
├── package.json                     
├── pages/                           
│   ├── daily-challenge.vue          # Layout for GamePresenter, SidebarPresenter and PlayAgainPresenter (www.whokipedia.com/daily-challenge)
│   ├── reset-password.vue           # Layout for ResetPasswordPresenter.vue (www.whokipedia.com/)
│   ├── index.vue                    # Layout for WelcomePagePresenter.vue
│   └── solo-mode.vue                # Layout for GamePresenter, SidebarPresenter and PlayAgainPresenter (www.whokipedia.com/solo-mode)
├── presenters/                      
│   ├── GamePresenter.vue            # Presenter for GameCenterView and InfoboxView
│   ├── ResetPasswordPresenter.vue   # Presenter for ResetPasswordView
│   ├── HeaderPresenter.vue          # Presenter for  HeaderView
│   ├── PlayAgainPresenter.vue       # Presenter for PlayAgainView
│   ├── SidebarPresenter.vue         # Presenter for SidebarView
│   └── WelcomePagePresenter.vue     # Presenter for WelcomePageView
├── tailwind.config.ts               
├── tsconfig.json                    
├── utilities/  
│   ├── Auth.ts                      # Handle authentication with Firebase Auth
│   ├── Firebase.ts                  # Handle database requests with Firebase Realtime Database
│   └── Utils.ts                     # Utilities functions
└── views/                           
    ├── AccountView.vue              # Tabs for StatisticsView and UserManagementView
    ├── GameCenterView.vue           # Game layout with intro paragraphs and InfoboxView
    ├── HeaderView.vue               # Header UI, with LoginSignupView, LeaderboardView and AccountView as modals
    ├── InfoboxView.vue              # Main picture and short celebrity infobox
    ├── LeaderboardView.vue          # Leaderbaord
    ├── LoginSignupView.vue          # Tabs for LoginView and SignupView
    ├── LoginView.vue                # Login form
    ├── PlayAgainView.vue            # Play again buttons
    ├── ResetPasswordView.vue        # Reset password form
    ├── SearchFieldView.vue          # Search bar for guesses input
    ├── SidebarView.vue              # Rules, and current game info (n° hints remaining and elapsed time) 
    ├── SignupView.vue               # Signup form 
    ├── StatisticsView.vue           # Statistics
    ├── UserManagementView.vue       # User account management
    └── WelcomePageView.vue          # Welcome page
```
