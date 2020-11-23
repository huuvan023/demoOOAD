<template>
  <div class="col-12">
    <div class="col-12 row">
      <q-select class="col-4" style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif'
                filled v-model="searchGr"  :options="options" label="Tìm sách theo" />
      <q-input filled class="col-4 q-mx-md" label="Nhập keyword" v-if="searchGr !==''"/>
      <q-btn class="col-1 q-ml-lg" label="Tìm" @click=" " color="primary"/>
    </div>
    <div>
      <q-table
        title="Treats"
        :data="tableData"
        :columns="columns"
        row-key="name">
        <template v-slot:top>
          <q-btn  outline color="primary" label="Thêm sách +" @click="() => {dialogThemSach = !dialogThemSach;}" />
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
      <q-dialog class="bg-white" v-model="dialogThemSach">
        <div class="q-pa-md bg-white"
             style="width: 500px">
          <div class="text-weight-bold text-h6 q-mb-sm">Thêm sách</div>
          <q-form class="q-gutter-md" >
            <q-uploader
              url=""
              @added="uploadImg"
              style="max-width: 300px"
            />
            <q-input
              filled
              v-model="newBook.TenSach"
              label="Tên sách"
              lazy-rules

            />
            <q-select :options="chudeSach" v-model="newBook.ChuDe" label="Chủ đề sách" filled/>
            <q-select :options="nhaxuatban" v-model="newBook.NXB" label="Nhà xuất bản" filled/>
            <q-input
              filled
              v-model="newBook.SLTon"
              label="Số lượng tồn"
              lazy-rules
            />
            <q-input
              filled
              type="textarea"
              v-model="newBook.MoTa"
              label="Mô tả ngắn"
            />
            <q-input
              filled
              v-model="newBook.TenTacGia"
              label="Tên tác giả"
            />
            <q-input
              filled
              v-model="newBook.NamXB"
              label="Năm xuất bản"
            />
            <div>
              <q-btn @click="" label="Thêm độc giả" color="primary"/>
              <q-btn label="Hủy bỏ" @click="() => {dialogThemSach = false}" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>

        </div>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import {connection} from "boot/connection";
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'huuvan',
  api_key: '668874124348985',
  api_secret: 'zEdMrb7LOxalOIcY40zEoiF-gSI'
});


export default {
  name: "QuanLySach",
  data: () => ({
    options: [
      {
        label: 'Tên',
        value: 'TenSach'
      },
      {
        label: 'Nhà xuất bản',
        value: 'idNXB'
      },
      {
        label: 'Tên tác giả',
        value: 'TenTacGia'
      },
    ],
    searchGr: '',
    columns: [
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
    dialogThemSach: false,
    newBook: {},
    chudeSach: [],
    nhaxuatban: []
  }),
  async mounted() {
    await this.getChuDeSach()
    await this.getNXB()
  },
  methods: {
    async getChuDeSach() {
      await connection.query('SELECT * FROM chudesach', (err, row, field) => {
        row.forEach(item => {
          this.chudeSach.push({
            label: item.TenChuDe,
            value: item.idChuDe
          })
        })
      })
    },
    async getNXB() {
      await connection.query('SELECT * FROM nhaxuatban', (err, row, field) => {
        row.forEach(item => {
          this.nhaxuatban.push({
            label: item.Ten_NXB,
            value: item.idNXB,
            diachi: item.DiaChi,
            DienThoai: item.DienThoai
          })
        })
      })
    },
    uploadImg(e) {
      console.log(e.target.files[0])
    }
  }
}
</script>

<style scoped>

</style>
