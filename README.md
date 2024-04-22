<p align="center">
  <a href="https://whokipedia.com">
    <img src="https://github.com/roxannecvl/whokipedia/assets/125833841/7c6187cd-d6ec-4b97-8928-ae01c4b08cc6" alt="image" width="300">
  </a>
</p>


#### Test your knowledge of the who's who in Whokipedia, where each clue leads you closer to uncovering the celebrity behind the blur !

### Description 
Our web app is a game called Whokipedia. It takes its root in the famous game "Guess Who ?", and is inspired from the wikipedia interface. As a player you will start with a wikipedia-like page with some basic information about a mysterious celebritiy. Your goal is to try to guess the celebrity, for instance a first hint could be the birthdate. If you fail to guess correctly at first, we will give you a second hint (could be a sentence from the wikipedia description, the occupation, nationality, blurred photo, …) and reveal it as a part of the wikipedia interface. Each time you make a guess, you get a new hint, until you finally uncover the celebrity is or until all hints are revealed. The less hints you needed, the better your rank ! <br>

There are two modes, daily challenges and training. In training, you play for yourself, and can play as many times as you want. The daily challenges take their inspiration from wordle. The goal stays the same but there is only one celebrity to guess each day. For the daily challenges, a leaderboard is created. If you want your score to be displayed on the leaderboard, you should be loged in, however you can also play as a visitor but that means that your performance will not be saved. <br>

Finally, once the game is done and the celebrity revealed, a link to the wikipedia page of the celebrity will appear, inviting you to learn more about the celebrity of the day if your curiosity has been spiked. If you are loged in, you can also browse through your old games, points, and celebrities found.

### Already implemented 
Here is the list of our already implemented features 
- Api Calls
- Part of the parsing the response from fetchInfobox
- Login form (view)
- Signup form (view)
- Statistics view (v1)
- Search field with auto-complete and suggestion
- GameModel
- UserModel 

### To be done 
- Daily Challenge page (view, presenter and page) 
- Training Page (view, presenter and page) 
- First page with the logo, rules and login (view, presenter and page) 
- Finish the parsing of the response from fetchInfobox
- Final version of the statisctics page
- Leaderboard page (view, presenter and page)
- SignupLoginPresenter
- Statistics page (page and presenter and view v2)
- app.vue (update it with SignupLoginPresenter) 

### File structure 
```
whokipedia/                          # 
├── LICENSE                          #
├── README.md                        #
├── api/                             # Contains all files for talking to the api and parsing the responses
│   └── WikipediaSource.ts           #
├── app.config.ts                    #
├── app.vue                          # Contains signupLoginPresenter.vue, logo (title version), black mode button and git button
├── model/                           #
│   ├── CelebrityList.ts             # Contains the list of playable celebrity and function to get suggestions for seach field
│   ├── GameModel.ts                 # Contains all the logic for the current game played 
│   ├── Hint.ts                      # Declaration of Hint type (and method to create a list of hints from an object)
│   ├── UserModel.ts                 # Contains all the logic and data of the loged in user
│   ├── FirebaseModel.ts             # Contains all logic for talking to our database
├── nuxt.config.ts                   #
├── package.json                     # All our dependencies 
├── pages/                           #
│   ├── daily-challenge.vue          # with GamePresenter and SidebarPresenter together
│   ├── index.vue                    # with WelcomePagePresenter.vue
│   ├── leaderboard.vue              # with LeaderboardPresenter.vue
│   ├── statistics.vue               # with StatisticsPresenter.vue
│   └── training.vue                 # with GamePresenter and SidebarPresenter together
├── presenters/                      #
│   ├── GamePresenter.vue            # with GameCenterView.vue and InfoboxView.vue
│   ├── LeaderboardPresenter.vue     # with LeaderboardView.vue
│   ├── HeaderPresenter.vue          # with HeaderView.vue
│   ├── SidebarPresenter.vue         # with SidebarView.vue
│   ├── StatisticsPresenter.vue      # with StatisticsView.vue
│   └── WelcomePagePresenter.vue     # with WelcomePageView.vue
├── tailwind.config.ts               #
├── tsconfig.json                    #
├── utilities/                       #
│   └── Utils.ts                     # utilities function, like getAverage(), getRandom(),  ...
└── views/                           #
    ├── GameCenterView.vue           # contains the search bar and the intro paragraph of the celebrity 
    ├── InfoboxView.vue              # contains the photo and the short informations about the celebrity (like right box in wikipedia)
    ├── LeaderboardView.vue          # contains the leadedboard (if  logged in) 
    ├── LoginView.vue                # log in form 
    ├── SidebarView.vue              # rules, login button, logo (train and leaderboard button if done) 
    ├── SignupView.vue               # sign up form 
    ├── StatisticsView.vue           # statistics of the user (if loged in) 
    └── WelcomePageView.vue          # One play button, the rules and the logo
```

### Tools used 
Our project is written in typescript and vue. Here is a presentation of some of our dependencies : <br>

**Firebase** : Firebase is a comprehensive platform provided by Google for building web and mobile applications. We use its real-time database, authentication, and deployment functions.

**Nuxt.js**: Nuxt.js is a framework built on top of Vue.js that provides a higher-level structure for building universal Vue.js applications. We use it to get Nuxt UI, a set of components and utilities provided by Nuxt.js for building user interfaces. It includes a variety of pre-designed UI components and layouts. It helps us create a beautiful and responsive user interface.

**Tailwind CSS**: Tailwind CSS is a utility-first CSS framework that provides low-level utility classes for building custom designs without having to write custom CSS. We use it to get a light and dark mode.

**Chart.js**: Chart.js is a JavaScript library for creating responsive and interactive charts and graphs. We use it for our statistics page.

**Fuse.js**: Fuse.js is a lightweight fuzzy-search library for JavaScript that provides fast and efficient search functionality for arrays of objects. We use it for our search field, to get celebrity suggestions. 
