<template>
  <div class="select-guest">
    <button class="select-guest--btn">
      {{ allGuest }} гостя
      <span class="ico-arrow"></span>
    </button>
    <div class="select-guest--modal">
      <div class="guest">
        <div class="guest--name">
          Взрослые
        </div>
        <div class="guest--count">
          <button @click="adultsBtn('minus')" class="minus"></button>
          <input type="number" min="1" v-model="guest.adults">
          <button @click="adultsBtn('plus')" class="plus"></button>
        </div>
      </div>
      <div class="guest">
        <div class="guest--name">
          Дети до 17 лет
        </div>
        <div class="guest--count">
          <button @click="childrensBtn('minus')" class="minus"></button>
          <input type="number" min="0" max="30" v-model="guest.childrens.length">
          <button @click="childrensBtn('plus')" class="plus"></button>
        </div>
      </div>
      <div class="childrens" v-if="guest.childrens.length">
        <div class="childrens--name">Возраст детей:</div>
        <div class="childrens--count">
          <select
              v-for="(item, index) in guest.childrens.length"
              :key="index"
              v-model="guest.childrens[index]"
          >
            <option
              v-for="child in 17"
              :value="child"
              :key="child"
              :selected="guest.childrens[index] == child"
            >
              {{ child }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BaseSelectGuest",
    data() {
      return {
        guest: {
          adults: 1,
          childrens: []
        }
      }
    },
    computed: {
      allGuest() {
        return +this.guest.adults + this.guest.childrens.length;
      }
    },
    methods: {
      adultsBtn(val) {
        if (val == "minus") {
          this.guest.adults--
          if (this.guest.adults <= 1) {
            this.guest.adults = 1;
          }
        } else if (val == "plus") {
          this.guest.adults++
        }
      },
      childrensBtn(val) {
        if (val == "minus") {
          if (this.guest.childrens.length > 0) {
            this.guest.childrens.pop();
          }
        } else if (val == "plus") {
          if (this.guest.childrens.length < 30) {
            this.guest.childrens.push(1);
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.select-guest {
  position: relative;
  display: inline-block;
  vertical-align: top;
  max-width: 160px;
  width: 100%;
  text-align: left;
  &--btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 34px 0 20px;
    margin: 0;
    outline-style: none;
    background: #fff;
    font-size: 15px;
    color: #444444;
    border: none;
    height: 58px;
    width: 100%;
    border-radius: 0px 2px 2px 0px;
    position: relative;
    .ico-arrow {
      display: block;
      width: 12px;
      height: 6px;
      position: absolute;
      top: 50%;
      right: 24px;
      margin-top: -3px;
      transform: rotate(0deg);
      &.active {
        transform: rotate(180deg);
      }
      &:after, &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        background: #999;
        height: 1px;
        width: 8px;
        margin: 2px 0 0 0;
      }
      &:after {
        transform: rotate(45deg);
      }
      &:before {
        transform: rotate(-45deg);
        margin: 2px 0 0 5px;
      }
    }
  }
  &--modal {
    background: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    width: 248px;
    margin-top: 2px;
    .guest {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 20px;
      &--name {
        font-size: 15px;
        color: #444444;
      }
      &--count {
        display: flex;
        align-items: center;
        button {
          display: block;
          width: 18px;
          height: 18px;
          cursor: pointer;
          outline-style: none;
          margin: 0;
          border: none;
          background: none;
          position: relative;
          &:after {
            content: '';
            width: 12px;
            height: 2px;
            position: absolute;
            top: 8px;
            left: 3px;
            background: #999;
          }
          &.plus {
            &:before {
              content: '';
              width: 2px;
              height: 12px;
              position: absolute;
              top: 3px;
              left: 8px;
              background: #999;
            }
          }
        }
        input[type="text"], input[type="number"] {
          display: block;
          outline-style: none;
          padding: 0;
          margin: 0;
          border: none;
          background: none;
          width: 32px;
          text-align: center;
          color: #444444;
          font-size: 15px;
          -moz-appearance: textfield;
          &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          &:hover, &:focus {
            -moz-appearance: number-input;
          }
        }
      }
    }
    .childrens {
      padding: 14px 20px 10px;
      background: #EDEDED;
      &--name {
        font-size: 13px;
        color: #444444;
        margin-bottom: 8px;
      }
      &--count {
        display: flex;
        flex-wrap: wrap;
        select {
          display: block;
          outline-style: none;
          padding: 0 0 0 12px;
          margin: 0 10px 10px 0;
          width: 62px;
          height: 31px;
          font-size: 14px;
          color: #444444;

          border: 1px solid #ccc;
          border-radius: 3px;
          background-color: #fff;
          -webkit-appearance: none;
          background-image: url('./../assets/arrow-select.svg');
          background-position: right 12px top 6px;
          background-repeat: no-repeat;
          line-height: 1em;
          /* for FF */
          -moz-appearance: none;
          text-indent: 0.01px;
          text-overflow: '';
          /* for IE */
          -ms-appearance: none;
          appearance: none!important;
          &::-ms-expand {
            display: none;
          }
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
