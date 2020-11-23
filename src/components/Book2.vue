<template>
  <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12  q-px-sm-sm">
    <q-card class="q-ma-md">
      <q-card-section class="col-12 no-padding">
        <div class="col-12 flex justify-center">
          <img :src="sach.img"/>
        </div>
        <div class="q-mb-md full-width text-center ">
          <div class="flex q-mb-md justify-center text-h6 text-weight-bold q-mt-xs-xs q-mt-md-md  full-width">
            {{ sach.TenSach }}
          </div>
          <div class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            {{ sach.MoTa }}
          </div>
          <div class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            Tác giả: {{ sach.TenTacGia }}
          </div>
          <div class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            Nhà xuất bản: {{ this.NXBB }}
          </div>
          <div class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            Năm xuất bản: {{ sach.NamXuatBan }}
          </div>
          <div class="flex justify-center q-mt-xs-xs q-mt-md-md full-width">
            <div  v-if="hasRole('user')"  class="flex text-h6 text-weight-bold q-my-md">
              <q-btn @click="$emit('MuonSach', currSach)" label="Mượn sách này"/>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {connection} from "boot/connection";

export default {
  name: "Book2",
  methods: {
    hasRole(role) {
      if (localStorage.getItem('role') === role) {
        return true
      }
      return false
    },
    NXB() {
      var query = `select Ten_NXB from nhaxuatban where idNXB='${this.sach.idNXB}'`
      connection.query(query, (err, row, field) => {
        this.NXBB = row[0].Ten_NXB
      })
    },
  },
  props: {
    sach: {
      require: true,
      type: Object
    },
    ngayHetHan: {
      require: false,
      type: String
    },
  },
  data: () => ({
    NXBB: '',
    currSach : {}
  }),
  computed: {

  },
  async mounted() {
    this.currSach = this.sach
    await this.NXB()
  }
}
</script>

<style scoped>

</style>
