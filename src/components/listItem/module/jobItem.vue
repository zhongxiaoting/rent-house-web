<template>
  <div class="job-info-box" @click="handleClick">
    <div class="job-info">
      <div class="job-name ellipsis">
        <span>{{ jobInfo.job_name }}</span>
      </div>
      <div class="job-other-info">
        <div class="provide-salary">
          <span>{{ jobInfo.provide_salary }}</span>
        </div>
        <div class="requirement">
          <span class="tags job-area">{{ jobInfo.job_area }}</span>
          <span class="tags work-year">{{ jobInfo.work_year }}</span>
          <span class="tags degree">{{ jobInfo.degree }}</span>
        </div>
      </div>
      <div class="job-tags ellipsis">
        <el-tag
            v-for="(item,index) in jobInfo.job_tags"
            :key="`${item}-${index}`"
            :disable-transitions="true"
            class="tags-item"
        >{{ item }}
        </el-tag>
        <el-tag>更多({{ jobInfo.job_tags_surplus }})</el-tag>
      </div>
    </div>
    <div class="company-info-box">
      <div class="company-info">
        <div class="company-name ellipsis">
            <span>
              {{ jobInfo.company_name }}
            </span>
        </div>
        <div class="company-industry-type">
            <span>
              {{ jobInfo.industry_type }}
            </span>
        </div>
      </div>
      <div class="job-issue-data">
          <span>
            {{ jobInfo.issue_date }}
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "jobItem",
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    jobInfo() {
      const tagsList = JSON.parse(this.data.job_tags.replace(/'/g, '"'))
      return {
        ...this.data,
        job_tags: tagsList.splice(0,5),
        job_tags_surplus: tagsList.length,
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('item-click')
    },
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";

@mixin flex-end {
  display: flex;
  justify-content: flex-end;
}
.job-info-box {

  display: flex;
  justify-content: space-between;
  flex: 1;
  //margin-right: 10px;
  margin-top: 10px;


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
.job-info-box:not(:last-child) {
  padding-bottom: 10px;
  border-bottom: 2px solid $bottom-color;
}
</style>
