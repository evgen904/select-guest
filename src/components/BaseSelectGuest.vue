<template>
  <div class="select-guest" v-click-outside="close">
    <button class="select-guest--btn" @click="modal = !modal">
      {{ allGuest }} гостя
      <span class="ico-arrow" :class="{'active': modal}"></span>
    </button>
    <transition :name="'modal-guest-'+viewPort">
      <div class="modal" :class="viewPort" v-if="modal">
        <div class="modal--header" v-if="viewPort == 'mobile'">
          <div class="modal--close" @click="close"></div>
          Выбор гостей
        </div>
        <div class="modal--body">
          <div class="select-guest--modal">
            <div class="guest">
              <div class="guest--name">
                Взрослые
              </div>
              <div class="guest--count">
                <button @click="adultsBtn('minus')" class="minus"></button>
                <input type="number" min="1" v-model="guest.adults" @input="changeAdults" @keypress="isNumber($event)">
                <button @click="adultsBtn('plus')" class="plus"></button>
              </div>
            </div>
            <div class="guest">
              <div class="guest--name">
                Дети до 17 лет
              </div>
              <div class="guest--count">
                <button @click="childrensBtn('minus')" class="minus"></button>
                <input type="number" min="0" :max="maxChildrens" v-model="countChildrens" @keypress="isNumber($event)" placeholder="0">
                <button @click="childrensBtn('plus')" class="plus"></button>
              </div>
            </div>
            <div class="childrens" v-if="countChildrens">
              <div class="childrens--name">Возраст детей:</div>
              <div class="childrens--count">
                <select
                  v-for="(item, index) in +countChildrens"
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
        <div class="modal--footer" v-if="viewPort == 'mobile'">
          <button @click="close">
            Ок
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    name: "BaseSelectGuest",
    data() {
      return {
        guest: {
          adults: 1,
          childrens: []
        },
        countChildrens: 0,
        maxChildrens: 9,
        modal: false,
        viewPort: "desktop"
      }
    },
    created() {
      if (localStorage.getItem("select_guest") !== null) {
        this.guest = JSON.parse(localStorage.getItem("select_guest")).guest;
        this.countChildrens = JSON.parse(localStorage.getItem("select_guest")).guest.childrens.length;
      }
    },
    computed: {
      allGuest() {
        return +this.guest.adults + +this.countChildrens;
      }
    },
    watch: {
      'guest.adults'() {
        this.saveLocalStorage();
      },
      'guest.childrens'() {
        this.saveLocalStorage();
      },
      countChildrens(val) {
        let thisVal = +val;
        if (thisVal > 9) {
          this.countChildrens = 9;
        }
        if (this.guest.childrens.length+1 == thisVal || thisVal > this.guest.childrens.length) {
          for (let i = 0; i < thisVal; i++) {
            if (this.guest.childrens[i] === undefined) {
              this.guest.childrens.push(1);
            }
          }
        } else {
          this.guest.childrens.splice(thisVal, this.guest.childrens.length - thisVal);
        }
      },
      modal(val) {
        if (val == true && this.viewPort == "mobile") {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    },
    methods: {
      changeAdults:_.debounce(function() {
        if (this.guest.adults == "") {
          this.guest.adults = 1;
        }
      }, 500),
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
          this.countChildrens--
          if (this.countChildrens <= 0) {
            this.countChildrens = 0;
          }
        } else if (val == "plus") {
          if (this.countChildrens < this.maxChildrens) {
            this.countChildrens++
          }
        }
        this.saveLocalStorage();
      },
      saveLocalStorage() {
        localStorage.setItem(
          "select_guest",
          JSON.stringify({
            guest: this.guest
          })
        );
      },
      close() {
        this.modal = false;
      },
      isNumber: function(evt) {
        evt = evt ? evt : window.event;
        let charCode = evt.which ? evt.which : evt.keyCode;
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.modal-guest-mobile-enter-active,
.modal-guest-mobile-leave-active {
  transform: translateX(0%);
  transition: transform 0.35s ease;
}
.modal-guest-mobile-enter,
.modal-guest-mobile-leave-to {
  transform: translateX(100%);
}


.modal-guest-desktop-enter-active, .modal-guest-desktop-leave-active {
  transition: opacity .2s;
}
.modal-guest-desktop-enter, .modal-guest-desktop-leave-to {
  opacity: 0;
}


.modal {
  &.mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  &--header {
    background: #444444;
    color: #ffffff;
    font-size: 17px;
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &--body {
    flex: auto;
  }
  &--footer {
    padding: 10px;
    button {
      display: block;
      outline-style: none;
      padding: 8px 20px;
      margin: 0;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      background: #498BC3;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 3px;
      width: 100%;
    }
  }
  &--close {
    position: absolute;
    font-size: 64px;
    line-height: 40px;
    width: 28px;
    height: 50px;
    transform: scale(0.7);
    cursor: pointer;
    top: 0;
    left: 10px;
    padding-left: 12px;
    &::before,
    &::after {
      content: "";
      background-color: white;
      width: 4px;
      height: 20px;
      display: inline-block;
    }
    &::before {
      transform: rotate(45deg) translate(-6px, -10px);
      transform-origin: 100% 50%;
    }
    &::after {
      transform: rotate(-45deg);
      transform-origin: 0% 50%;
    }
  }
  &.mobile {
    .select-guest--modal {
      position: static;
      margin: 0;
      width: 100%;
    }
  }
}
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
        width: 100%;
        max-width: 230px;
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
