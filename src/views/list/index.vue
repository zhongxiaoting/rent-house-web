<template>
  <div class="back-box">
    <div class="body">
      <div class="container">
        <div class="search">
          <el-input v-model="searchValue" placeholder="请输入内容"></el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </div>
      <div class="container" v-loading="loading">
        <list-item
          :list="list"
          :list-key="currListKey"
          @to-details-view="handleToDetails"
        ></list-item>
        <div class="page-button" v-if="showPageButton">
          <el-pagination
              background
              layout="prev, pager, next"
              v-bind="pageInfo"
              @current-change="handleCurrentChange"
              :total="1000">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import listItem from "@/components/listItem/index.vue";
import {getJobList, getHouseList, jobSearch, houseSearch} from "@/api/public";
export default {
  name: "list-View",
  data() {
    return {
      list: [],
      pageInfo: {
        pageCount: 10,
        pagerCount: 5,
        currentPage: 1,
        total: 1022,
      },
      searchValue: '',
      currListKey: '',
      loading: false,
      showPageButton: true
    }
  },
  components: {
    listItem
  },
  watch: {
    '$route.query.key'(newValue, oldValue) {
      if (newValue !== oldValue) {
        // this.isSearched = false
        this.list = []
        this.searchValue = ''
      }
      if (!this.$isEmpty(newValue)) {
        this.currListKey = newValue;
        this.initData(newValue)
      }
    },
  },
  methods: {
    handleSearch() {
      this.initData()
      this.showPageButton = this.$isEmpty(this.searchValue);

    },
    getInitFunc(key) {
      let initFunc
      switch (key) {
        case 'job': {
          initFunc = this.$isEmpty(this.searchValue) ? getJobList : jobSearch
          break;
        }
        case 'house': {
          initFunc = this.$isEmpty(this.searchValue) ? getHouseList : houseSearch
          break;
        }
      }
      return initFunc
    },
    getList(initFunc) {
      let parmas

      if (this.$isEmpty(this.searchValue)) {
        parmas = {
          page: this.pageInfo.currentPage
        }
      } else {
        parmas = {
          search: this.searchValue
        }
      }

      initFunc(parmas).then(res => {
        const {object_list, house_lists, job_lists, num_pages} = res
        this.pageInfo.pageCount = num_pages
        this.list = object_list || house_lists || job_lists
      }).finally(() => {
        this.loading = false
      })
    },
    initData() {
      const func = this.getInitFunc(this.currListKey)
      if (!this.$isEmpty(func)) {
        this.getList(func)
      }
    },
    handleCurrentChange(value) {
      this.loading = true
      this.pageInfo.currentPage =value
      this.initData(this.currListKey)
    },
    handleToDetails(object) {
      switch (this.currListKey) {
        case 'job': {
          this.$router.push({
            name: 'JobDetails',
            params: {
              jobInfo: JSON.stringify({
                ...object,
                job_tags: JSON.parse(object.job_tags.replace(/'/g, '"')),
              })
            }
          })
          break;
        }
        case 'house': {
          this.$router.push({
            name: 'HouseDetails',
            params: {
              houseInfo: JSON.stringify(object)
            }
          })
          break;
        }
      }
    }
  },
  created() {
    const {key} = this.$route.query
    this.currListKey = key
    this.initData()
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";
.back-box {
  height: calc(100vh - 56px);
  overflow: auto;
  display: flex;
  justify-content: center;
  .body {
    min-width: 1040px;

    .container {
      margin-top: 10px;
      padding: 10px;
      background-color: #ffffff;
      border-radius: 10px;
    }

    .search {
      display: flex;

      .el-button {
        background-color: $primary-color;
      }
    }

    .page-button {
      margin: 10px 0;
      display: flex;
      justify-content: center;
    }

  }
}
</style>

