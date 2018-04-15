import { configure } from '@storybook/vue';

import Vue from 'vue';

// Import your custom components.
import SparkLine from "../src/components/SparkLine";


// Register custom components.
Vue.component('SparkLine', SparkLine);

function loadStories() {
    // You can require as many stories as you need.
    require('../src/stories');
}

configure(loadStories, module);
