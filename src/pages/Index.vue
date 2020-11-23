<template>
  <div class="col-12 row q-pa-xs">
    <Book v-for="item in listSach"
          @MuonSach = "MuonSach"
          :sach="item" :key="item.idSach"/>
  </div>
</template>

<script>
import Book from "components/Book";
import {connection} from "boot/connection";
export default {
  name: 'PageIndex',
  components: {Book},
  data: () => ({
    listSach: []
  }),
  mounted() {
    this.getSach()
  },
  methods: {
    async getSach() {
      var query = `select * from sach`
      await connection.query(query, (err,row,field) => {
        this.listSach = [...row]
      })
    },
    async MuonSach (sach) {
      var d = new Date()
      if (confirm(`Bạn có chắc chắn muốn mượn sách ${sach.TenSach} ?`)) {
        const query = `insert into phieumuon values ('${sach.idSach}${JSON.parse(localStorage.getItem('user')).idUser}', 'Đang mượn', '${d}','${this.addDays(d, 7)}','${sach.idSach}')`
        await connection.query(query, (err, row, field) => {
          if (!err) {
            this.$q.notify({
              message: 'Mượn sách thành công!',
              color: 'positive',
              position: 'top'
            })
          }
          else {
            this.$q.notify({
              message: 'Sách đã mượn!',
              color: 'negative',
              position: 'top'
            })
          }
        })

      }
    },
    getDSMuon() {
      var query = `select * from phieumuon`
    },
    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  }
}
</script>
