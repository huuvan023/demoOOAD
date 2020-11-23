<template>
  <div class="col-12 row q-pa-xs">
    <Book v-for="item in listSach" :sach="item" :key="item.idSach"/>
  </div>
</template>

<script>
import Book from "components/Book";
import {connection} from "boot/connection";
export default {
  name: 'SachDangMuon',
  components: {Book},
  data: () => ({
    listSach: [],
    cauquery: []
  }),
  async mounted() {
    this.$q.loading.show()
    await this.getSach()
    this.$q.loading.hide()
  },
  methods: {
    async getSach() {
      var query = `select * from phieumuon`
      await connection.query(query, async (err,row,field) => {
        row.forEach(item => {
          var query = `select * from sach where idSach = '${item.idSach}'`
          connection.query(query, (err, row, field) => {
            this.listSach.push({...row[0], damuon: true,idPhieuMuon: item.idPhieuMuon})
          })
        })
      })
    },
  }
}
</script>
