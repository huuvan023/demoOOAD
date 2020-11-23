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
          <div v-if="sach.damuon" class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
           Trạng thái: {{ this.trangthai.Status }}
          </div>
          <div v-if="sach.damuon" class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            Ngày mượn: {{ `${(new Date(this.trangthai.NgayMuon)).getDate()} - ${(new Date(this.trangthai.NgayMuon)).getMonth() + 1} - ${(new Date(this.trangthai.NgayMuon)).getFullYear()}` }}
          </div>
          <div v-if="sach.damuon" class="flex q-mb-md justify-center text-h6q-mt-xs-xs q-mt-md-md  full-width">
            Ngày trả: {{ `${(new Date(this.trangthai.NgayTra)).getDate()} - ${(new Date(this.trangthai.NgayTra)).getMonth() + 1} - ${(new Date(this.trangthai.NgayTra)).getFullYear()}` }}
          </div>
          <div class="flex justify-center q-mt-xs-xs q-mt-md-md full-width">
            <div  v-if="hasRole('user') && !sach.damuon"  class="flex text-h6 text-weight-bold q-my-md">
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
  name: "Book",
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
    }
  },
  data: () => ({
    NXBB: '',
    currSach: {},
    trangthai: {}
  }),
  computed: {

  },
  async mounted() {
    this.currSach = this.sach
    await this.NXB()
    if (this.sach.idPhieuMuon) {
      connection.query(`select * from phieumuon where idPhieuMuon = '${this.sach.idPhieuMuon}'`, (err, row, field) => {
        this.trangthai = row[0]
        console.log(this.trangthai)
      })
    }
  }
}
</script>

<style scoped>

</style>
