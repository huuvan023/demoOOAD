<template>
  <div class="col-12">
    <div class="col-12 row">
      <q-select class="col-4" style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif'
      filled v-model="filterU" @click.native="getUser" :options="options" label="Tìm độc giả" />
      <q-btn class="col-1 q-ml-lg" label="Tìm" @click="onSearch" color="primary"/>
    </div>
    <div class="col-12 q-mt-md">
      <q-table
        title="Treats"
        :data="tableData"
        :columns="columns"
        row-key="name">
        <template v-slot:top>
          <q-btn  outline color="primary" label="Thêm độc giả +" @click="() => {dialognewDocGia = !dialognewDocGia;themDG = true}" />
          <q-space />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="Action" :props="props">
              <q-btn color="primary" class="q-mr-xs" @click="SuaDG(props)" label="Sửa"/>
              <q-btn color="negative" @click="XoaNgDung(props.row)" label="Xóa"/>
            </q-td>
            <q-td key="id" :props="props">
              <q-badge color="green">
                {{ props.row.idDocGia }}
              </q-badge>
            </q-td>
            <q-td key="hoten" :props="props">
              {{ props.row.HoTen }}
            </q-td>
            <q-td key="NgaySinh" :props="props">
              {{ props.row.NgaySinh }}
            </q-td>
            <q-td key="DiaChi" :props="props">
              {{ props.row.DiaChi }}
            </q-td>
            <q-td key="ChiNhanh" :props="props">
              {{ props.row.ChiNhanh }}
            </q-td>
            <q-td key="LoaiNguoiDung" :props="props">
              {{ props.row.TenLoaiNguoiDung }}
            </q-td>
            <q-td key="SDT" :props="props">
              {{ props.row.SDT }}
            </q-td>
            <q-td key="CMND" :props="props">
              {{ props.row.CMND }}
            </q-td>
            <q-td key="NgayLap" :props="props">
              {{ props.row.NgayLap }}
            </q-td>
            <q-td key="username" :props="props">
              {{ props.row.username }}
            </q-td>
            <q-td key="password" :props="props">
              {{ props.row.password }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog class="bg-white" v-model="dialognewDocGia">
        <div class="q-pa-md bg-white"
        style="width: 500px">
          <div class="text-weight-bold text-h6 q-mb-sm">{{ themDG ? 'Thêm' : 'Sửa' }} độc giả</div>
          <q-form class="q-gutter-md" >
            <q-input
              filled
              v-model="newDocGia.HoTen"
              label="Họ tên độc giả"
              hint="Họ và tên"
              lazy-rules

            />
            <q-input
              filled
              v-model="newDocGia.NgaySinh"
              label="Ngày sinh"
              lazy-rules
            />
            <q-input
              filled
              v-model="newDocGia.DiaChi"
              label="Địa chỉ"
            />
            <q-select v-if="themDG"
                      :options="chiNhanh" v-model="newDocGia.ChiNhanh" label="Chi nhánh" filled/>
            <q-select v-if="themDG"
                      :options="loaiNgDung" v-model="newDocGia.TenLoaiNguoiDung" label="Loại người dùng" filled/>
            <q-input
              filled
              v-model="newDocGia.SDT"
              label="SDT"
            />
            <q-input
              filled
              v-model="newDocGia.CMND"
              label="CMND"
            />
            <q-input
              filled

              v-model="newDocGia.username"
              label="User name"
            />
            <q-input
              filled
              :type="isPwd ? 'password' : 'text'"
              v-model="newDocGia.password"
              label="Password"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn v-if="themDG" @click="addDocGia" label="Thêm độc giả" color="primary"/>
              <q-btn v-if="!themDG" @click="updateDocGia" label="Sửa độc giả" color="primary"/>
              <q-btn label="Hủy bỏ" @click="() => {dialognewDocGia = false; newDocGia = {}; isPwd= true; getUser()}" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>

        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import {connection} from "boot/connection";

export default {
  name: "QuanLyUser",
  async mounted() {
    await this.$q.loading.show()
    await this.getUser()
    await this.getChiNhanh()
    await this.getLoaiNguoiDung()
    this.$q.loading.hide()
  },
  data: () => ({
    tableData: [],
    filterU: null,
    options: [],
    themDG: false,
    chiNhanh: [],
    loaiNgDung: [],
    isPwd: true,
    columns: [

      { name: 'Action', label: 'Action', field: 'Action', align: 'left'},
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'idDocGia',
        format: val => `${val}`,
        sortable: true
      },
      { name: 'hoten', align: 'center', label: 'Họ và tên', field: 'HoTen', sortable: true },
      { name: 'NgaySinh', label: 'Ngày Sinh', field: 'NgaySinh'},
      { name: 'DiaChi', label: 'Địa chỉ', field: 'DiaChi' },
      { name: 'ChiNhanh', label: 'Chi Nhánh', field: 'Chi Nhanh' },
      { name: 'LoaiNguoiDung', label: 'Loại người dùng', field: 'TenLoaiNguoiDung' },
      { name: 'SDT', label: 'SDT', field: 'SDT' },
      { name: 'CMND', label: 'CMND', field: 'CMND'},
      { name: 'NgayLap', label: 'Ngày lập', field: 'NgayLap'},
      { name: 'username', label: 'Username', field: 'username'},
      { name: 'password', label: 'Password', field: 'password'},
    ],
    data: [],
    dialognewDocGia: false,
    newDocGia: {}
  }),
  methods: {
    async addDocGia() {
     try {
       var idUser = (new Date()).getMilliseconds()
       var d = Date.now()
       var dateNow =  `${new Date(d).getFullYear()} - ${new Date(d).getMonth()} - ${new Date(d).getDate()}`
       var query1 = `insert into nguoidung
        values('${idUser}', '${this.newDocGia.TenLoaiNguoiDung.value}','${this.newDocGia.HoTen}','${this.newDocGia.NgaySinh}','${this.newDocGia.DiaChi}','${this.newDocGia.SDT}','${this.newDocGia.CMND}')`;
       var query2 = `insert into docgia values('${(new Date()).getMilliseconds()}','${idUser}', '${this.newDocGia.ChiNhanh.value}', '${dateNow}', '${this.newDocGia.username}','${this.newDocGia.password}')`
       await connection.query(query1, async (err, row, field) => {
         if(!err) {
           await connection.query(query2, (err, row, field) => {
             if (!err) {
               this.$q.notify({
                 message: 'Thêm user thành công',
                 color: 'positive',
                 position: 'top'
               })
               this.dialognewDocGia = false
               return this.getUser()
             }
             else {
               this.$q.notify({
                 message: err,
                 color: 'negative',
                 position: 'top'
               })
             }
           })
         }
         else {
           this.$q.notify({
             message: err,
             color: 'negative',
             position: 'top'
           })
           console.log(err)
         }
       })
     }
     catch(e) {
       this.$q.notify({
         message: e,
         color: 'negative',
         position: 'top'
       })
     }
    },
    async updateDocGia() {
      console.log(this.newDocGia)
      var query1 = `update docgia set username = '${this.newDocGia.username}', password = '${this.newDocGia.password}' where idDocGia = '${this.newDocGia.idDocGia}'`;
      var query2 = `update nguoidung set HoTen = '${this.newDocGia.HoTen}', NgaySinh = '${this.newDocGia.NgaySinh}',
        DiaChi = '${this.newDocGia.DiaChi}', CMND = '${this.newDocGia.CMND}',SDT = '${this.newDocGia.SDT}' where idUser = '${this.newDocGia.idUser}'`

      await connection.query(query1, async  (err, row, field) => {
        if(!err) {
          await connection.query(query2, async  (err, row, field) => {
              if (!err) {
                this.$q.notify({
                  message: 'Sửa user thành công',
                  color: 'positive',
                  position: 'top'
                })
                this.dialognewDocGia = false
                return this.getUser()
              }
              else {
                this.$q.notify({
                  message: `error 2 :${err}`,
                  color: 'negative',
                  position: 'top'
                })
              }
          })
        }
        else {
          this.$q.notify({
            message: `error 1 :${err}`,
            color: 'negative',
            position: 'top'
          })
        }
      })
    },
    async getUser () {
      this.options = [{
        label: 'Tất cả',
        value: 'all'
      }]
      const query = `SELECT nguoidung.idUser,docgia.idDocGia,docgia.username,docgia.password,docgia.NgayLap,docgia.idChiNhanh as 'ChiNhanh',nguoidung.HoTen,nguoidung.NgaySinh,nguoidung.DiaChi,nguoidung.SDT,nguoidung.CMND,loainguoidung.TenLoaiNguoiDung
from qlthuvien.docgia inner join nguoidung on docgia.idUser = nguoidung.idUser inner join loainguoidung on nguoidung.idLoaiNguoiDung = loainguoidung.idLoaiNguoiDung;`
      await connection.query(query, (err, row, field) => {
        this.data = [...row]
        this.tableData = this.data
        if (this.options.length < 2) {
          this.data.map(item => {
            this.options.push({
              label: `${item.idDocGia} - ${item.HoTen}`,
              value: item.idDocGia,
            })
          })
        }
      })
    },
    async onSearch() {
      if (this.filterU && this.filterU.value !== 'all') {
        this.tableData = this.data.filter(item => {
          return item.idDocGia === this.filterU.value
        })
      } else {
        await this.getUser()
      }
    },
    async XoaNgDung(data) {
      if (confirm('Bạn có chắc chắn không ?')) {
        let query = `DELETE FROM docgia WHERE idDocGia = '${data.idDocGia}'`
        var query2 = `DELETE FROM nguoidung WHERE idUser = '${data.idUser}'`
        await connection.query(query, async (err, row, field) => {
          if(err) {
            this.$q.notify({
              message: err,
              color: 'negative',
              position: 'top'
            })
          }
          else {
            await connection.query(query, (err, row, field) => {
              if(err) {
                this.$q.notify({
                  message: err,
                  color: 'negative',
                  position: 'top'
                })
              }
              else {
                this.$q.notify({
                  message: 'Xóa user thành công',
                  color: 'positive',
                  position: 'top'
                })
                this.dialognewDocGia = false
                return this.getUser()
              }
            })
          }
        })
      }
    },
    getChiNhanh() {
      connection.query('SELECT * FROM chinhanh', async  (err, row, field) => {
       await row.forEach(item => {
         this.chiNhanh.push({
           label: `Chi nhánh ${item.idChiNhanh} - ${item.DiaChi} `,
           value: item.idChiNhanh,
           DiaChi: item.DiaChi
         })
       })

      })
    },
    getLoaiNguoiDung() {
      connection.query('SELECT * FROM loainguoidung', async  (err, row, field) => {
        await row.forEach(item => {
          this.loaiNgDung.push({
            label: item.TenLoaiNguoiDung,
            value: item.idLoaiNguoiDung
          })
        })
      })
    },
    SuaDG(data) {
      this.newDocGia = data.row
      this.dialognewDocGia = true
      this.themDG = false
    }
  }
}
</script>

<style scoped>

</style>
