<script
    setup
    lang="tsx">

import MyComponent
  from "~/views/MyComponent.vue";
import InfoboxView
  from "~/views/infoboxView.vue";
import {
  GameModel
} from "~/model/GameModel";
import { celebrities } from "~/model/CelebrityList";
import { Utils } from "~/utilities/Utils";

const Welcome = () =>
    <span>Welcome </span>

// Or using defineComponent setup that returns render function with JSX syntax
const Whokipedia = defineComponent(() => {
  return () =>
      <span
          class="text-primary font-bold">Whokipedia</span>
})

// We can combine views with JSX syntax too
const InlineComponent = () => (
    <div>
        <Welcome/>
    <span>to </span>
    <Whokipedia/>
    </div>
)

const model = reactive(new GameModel());
model.init(Utils.getRandom(celebrities));

</script>

<template>
  <div class="flex justify-between">
    <div>
      <InlineComponent/>
      <MyComponent
          message="Average between 1 and 2 is : "
          :n1=1
          :n2=2
      />
      <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        <ULink
            to="/">
          Go to home
        </ULink>
      </div>
    </div>
    <div class="w-60 ">
      <InfoboxView
          :model="model"
      />
    </div>
  </div>

</template>