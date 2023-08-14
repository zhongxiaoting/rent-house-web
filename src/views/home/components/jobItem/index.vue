<template>
  <div class="container">
    <div
      class="job-info-box"
      @click="handleToJobDetails"
    >
      <div class="job-info">
        <div class="spaceBetween job-name ellipsis">
          <span>{{jobData.job_name}}</span>
        </div>
        <div class="spaceBetween job-other-info">
          <div class="provide-salary">
            <span>{{ jobData.provide_salary }}</span>
          </div>
          <div class="requirement">
            <span class="tags job-area">{{ jobData.job_area }}</span>
            <span class="tags work-year">{{ jobData.work_year }}</span>
            <span class="tags degree">{{ jobData.degree }}</span>
          </div>
        </div>
        <div class="spaceBetween job-tags ellipsis">
           <el-tag
               v-for="(item,index) in jobData.job_tags"
               :key="`${item}-${index}`"
               :disable-transitions="true"
               class="tags-item"
           >{{ item }}</el-tag>
          <el-tag>更多({{jobData.job_tags_surplus}})</el-tag>
        </div>
      </div>
      <div class="company-info-box">
        <div class="company-info">
          <div class="spaceBetween company-name ellipsis">
            <span>
              {{ jobData.company_name }}
            </span>
          </div>
          <div class="spaceBetween company-industry-type">
            <span>
              {{ jobData.industry_type }}
            </span>
          </div>
        </div>
        <div class="job-issue-data">
          <span>
            {{ jobData.issue_date }}
          </span>
        </div>
      </div>
    </div>
    <div class="house-info-box">
      <div
        v-for="(houseItem, index) in jobData.house_list"
        :key="`house-item-${index}`"
        @click="handleToHouseNavigation"
        class="ellipsis"
      >
        {{ index+1 }} {{ houseItem.house}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "job-item",
  props: {
    jobData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleToJobDetails() {
      this.$emit('on-route-jump', {
        routeName: 'JobDetails',
        data: {
          jobInfo: this.jobData
        }
      })
    },

    handleToHouseNavigation() {
      this.$emit('on-click-house', {
        routeName: 'JobDetails',
        data: {
          id: this.jobData.id,
          list: this.jobData.house_list,
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@mixin flex-end {
  display: flex;
  justify-content: flex-end;
}

.container {
    padding: 10px;
    background-color: #fff;
    border-radius: 15px;
    width: 100%;

    display: flex;
    justify-content: space-between;

    .job-info-box {
      display: flex;
      justify-content: space-between;
      flex: 1;
      margin-right: 10px;
      cursor: pointer;

      .job-info {
        flex: 1;

        .job-name {

        }

        .job-other-info {
          display: flex;
          align-items: center;

          .provide-salary {
            color: #f40;
            font-size: 18px;
            margin-right: 15px;
          }

          .requirement {
            display: flex;
            font-size: 14px;
            color: #666666;
            align-items: center;

            .tags:not(:last-child) {
              padding: 0 10px;
              border-right: 1px solid rgba(0, 0, 0, .06);
            }
          }
        }

        .job-tags {
          color: #666666;

          .tags-item {
            padding: 0 10px;
          }

          .tags-item:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
      .company-info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .company-info {


          .company-name {
            @include flex-end;

          }
          .company-industry-type {
            @include flex-end;
            font-size: 14px;
            color: #666666;
          }
        }

        .job-issue-data {
          @include flex-end;
          font-size: 14px;
          color: #666666;
        }
      }
    }

    .house-info-box {
      cursor: pointer;
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
}

.container:not(:last-child) {
  margin-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.ellipsis {
  white-space: nowrap; /* 禁止折行 */
  overflow: hidden; /* 超出范围隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  width: 100%; /* 限制宽度 */
}

.spaceBetween {
  margin: 5px 0;
}
</style>
