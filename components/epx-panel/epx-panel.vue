<template>
  <view class="panel"
        @touchmove.prevent="touchmoveHandle"
        @touchstart.prevent="touchstartHandle"
        @touchend.prevent="touchendHandle"
        :style="{height: `${height}px`}"
        :class="{search_radius: !isScroll}">
    <slot name="head"></slot>
    <view class="panel_content">
      <scroll-view :scroll-y="isScroll" style="height: 100%">
        <slot></slot>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts">
import {Component, Emit, Prop, Mixins} from 'vue-property-decorator';
import VueMixins from "../../mixins/VueMixins";

@Component({name: 'SearchSlideUp'})
export default class SearchSlideUp extends Mixins(VueMixins) {
  @Prop({type: String, default: '请输入'}) placeholder: string | undefined;
  @Prop({type: Number, default: 48}) minHeight: number | undefined;
  @Prop({type: Number, default: 200}) middleHeight: number | undefined;

  maxHeight = this.ScreenHeight * 0.7;
  height = 48;
  lastY = 0;
  up = true;
  direction_flag = true;
  isScroll = false;

  touchstartHandle(e) {
    this.lastY = e.touches[0].pageY;
    console.log('START:', this.lastY)
  }

  touchendHandle(e) {
    console.log('END:')
    if (this.up) {
      if (this.height < this.middleHeight) {
        this.height = this.middleHeight
        this.isScroll = false
      } else {
        this.height = this.maxHeight
        this.isScroll = true
      }
    } else {
      if (this.height < this.middleHeight) {
        this.height = this.minHeight
        this.isScroll = false
      } else {
        this.height = this.middleHeight
        this.isScroll = false
      }
    }
    this.direction_flag = true
  }

  touchmoveHandle(e) {
    console.log('MOVE:')
    let currentY = e.touches[0].pageY
    let transformHeight = currentY - this.lastY
    this.height = this.height - (transformHeight / 20)
    if (this.height > this.maxHeight) {
      this.height = this.maxHeight
    }
    if (this.height < this.minHeight) {
      this.height = this.minHeight
    }
    if (this.direction_flag) {
      this.direction_flag = false
      if (transformHeight > 0) {
        // 下滑
        this.up = false
      } else {
        // 上滑
        this.up = true
      }
    }
  }
}
</script>

<style lang="scss">
.panel {
  z-index: 999;
  position: absolute;
  bottom: 0;
  width: 100vw;
  background-color: #ffffff;
  padding: 30 rpx 20 rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .search_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 20 rpx;

    .search_content {
      height: 74 rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #EBF0F3;
      border-radius: 16 rpx;
      border: 1 rpx solid #DFE4E7;
      padding: 0 20 rpx;

      .search_content_input {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .search_icon {
          margin-right: 10 rpx;
        }

        .search_text {
          color: #595E5F;
          font-size: 32 rpx;
          letter-spacing: 1.8 rpx;
        }
      }

      .search_suffix {
        width: 48 rpx;
        height: 48 rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .panel_content {
    width: 100%;
    height: 100%;
  }
}

.search_radius {
  border-radius: 20 rpx 20 rpx 0 0;
  box-shadow: 0 -8rpx 30 rpx rgba(0, 0, 0, 0.1);
}
</style>
