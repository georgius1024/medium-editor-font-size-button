<template>
  <div id="app" >
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Tiltle</h1>
        <medium-editor
          v-once
          :key="key"
          ref="title" 
          :text="text"
          :options="options()"
          custom-tag="div"
          @edit="updateTitle"
        />
      </div>
      <div style="width: 400px">
        <code>{{ displayTitle || text }}</code>
      </div>
    </div>
    <hr />
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Description</h1>
        <medium-editor
          v-once
          :key="key"
          ref="description" 
          :text="paragraphs"
          :options="options()"
          custom-tag="div"
          @edit="updateText"
        />
      </div>
      <div style="width: 400px">
        <code>{{ displayDescription || paragraphs }}</code>
      </div>
    </div>
    <hr />
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Button</h1>
        <medium-editor
          v-once
          :key="key"
          ref="button" 
          :text="button"
          :options="options()"
          custom-tag="button"
          @edit="updateButton"
        />
      </div>
      <div style="width: 400px">
        <code>{{ displayButton || button }}</code>
      </div>
    </div>
    <hr>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/mani.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./FontSizeButton";
import FontNameButton from "./FontNameButton";
import LineHeightButton from "./LineHeightButton";

export default {
  name: "App",
  components: {
    "medium-editor": editor,
  },
  data() {
    return {
      text: `<p style="font-size: 36px;">Click <span style="font-size: 27px;">here</span>&nbsp; to edit it or <span style="color: rgb(240, 50, 230);">highlight</span> the text to style it</p>`,
      paragraphs: `
      <p>The iconic ASICS Tiger GEL-Lyte III was originally released in 1990.</p>
      <p>Having over two decades of performance heritage, it offers fine design detailing and a padded split tongue to eliminate tongue movement, built on a sleek silhouette.</p>
      <p>It comes as no surprise the Gel-Lyte III is a fast growing popular choice for sneaker enthusiasts all over the world.</p>
      `,
      button: `Shop $ 242`,
      displayTitle: "",
      displayDescription: "",
      displayButton: "",
      key: 1,
    };
  },
  methods: {
    options() {
      return {
        extensions: {
          "font-size": new FontSizeButton(),
          "font-name": new FontNameButton(),
          "line-height": new LineHeightButton(),
        },
        toolbar: {
          buttons: [
            "font-name",
            "font-size",
            "line-height",
            "bold",
            "italic",
            "underline",
            "anchor",
            "unorderedlist",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "removeFormat",
          ],
          static: true,
          sticky: true,
          align: "center",
          updateOnEmptySelection: true,
        },
        placeholder: {
          text: "Type your text ПРЯМО ТУТ!!!",
          hideOnClick: true,
        },
      };
    },
    updateTitle(operation) {
      this.text = this.displayTitle = operation.api.origElements.innerHTML;
    },
    updateText(operation) {
      this.paragraphs = this.displayDescription = operation.api.origElements.innerHTML;
    },
    updateButton(operation) {
      this.button = this.displayButton = operation.api.origElements.innerHTML;
    },
    reset() {
      this.text = this.$refs.title.$el.innerHTML
      this.paragraphs = this.$refs.description.$el.innerHTML
      this.button = this.$refs.button.$el.innerHTML
      this.key = this.key + 1;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.font-picker-widget {
  .font-name {
    background-color: transparent;
    padding: 4px;
    outline: none;
    border: none;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
    & > * {
      margin: 4px;
      outline: none;
      border: none;
    }
  }
}
.size-picker-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  .display {
    padding: 4px;
    width: 40px;
    border: none;
    background-color: transparent;
    color: inherit;
    margin-right: 2px;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
  }
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      width: 12px;
      height: 12px;
      cursor: pointer;
      &:hover {
        outline: 1px solid white;
      }
    }
  }
}
</style>

<style>
.medium-editor-element {
  outline: none;
}

.medium-editor-placeholder:after {
  text-align: center;
  left: 0;
  right: 0;
}
</style>
