<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />

        <q-toolbar-title>
          Thư viện mở
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="400"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable  :active="tab === '/main'"
                  @click="clickIn('/main')" v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              Trang chủ
            </q-item-section>
          </q-item>

          <q-item clickable  :active="tab === '/bookborrow'"
                  @click="clickIn('/bookborrow')" v-ripple v-if="hasRole('user')">
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>
            <q-item-section>
              Sách đang mượn
            </q-item-section>
          </q-item>
          <q-item clickable  :active="tab === '/qluser'"
                  @click="clickIn('/qluser')" v-ripple v-if="hasRole('admin')">
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>
            <q-item-section>
              Quản lý user
            </q-item-section>
          </q-item>
          <q-item clickable  :active="tab === '/qlsach'"
                  @click="clickIn('/qlsach')" v-ripple v-if="hasRole('admin')">
            <q-item-section avatar>
              <q-icon name="bookmark" />
            </q-item-section>
            <q-item-section>
              Quản lý sách
            </q-item-section>
          </q-item>
          <q-item clickable  :active="tab === '/xlvipham'"
                  @click="clickIn('/xlvipham')" v-ripple v-if="hasRole('admin')">
            <q-item-section avatar>
              <q-icon name="warning" />
            </q-item-section>
            <q-item-section>
              Xử lý vi phạm
            </q-item-section>
          </q-item>
          <q-item :active="tab === '/bookrequire'"
                  @click="clickIn('/bookrequire')" clickable v-ripple v-if="hasRole('user')">
            <q-item-section avatar>
              <q-icon name="book" />
            </q-item-section>

            <q-item-section>
              Đang yêu cầu
            </q-item-section>
          </q-item>

          <q-item :active="tab === '/tthuvien'" @click="tab = '/tthuvien'"
            clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>
              Thông tin thư viện
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="onLogOut">
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>

            <q-item-section>
              Đăng xuất
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div @click="userDialog = true" class="text-weight-bold cursor-pointer">
            {{  userData.HoTen }}
          </div>

        </div>
      </q-img>
    </q-drawer>
    <q-dialog v-model="userDialog">
      <q-card class="my-card">


        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Thông tin tài khoản
            </div>
          </div>
          <br/>

        </q-card-section>

        <q-card-section class="q-pt-none">
          <div>Họ và tên:  {{userData.HoTen}}</div>
          <div>Loại:  {{ !this.user.idAdmin ? userData.TenLoaiNguoiDung : 'admin'}}</div>
          <div>
            Ngày sinh:
            {{ `${(new Date(userData.NgaySinh)).getDate()} - ${(new Date(userData.NgaySinh)).getMonth()} - ${(new Date(userData.NgaySinh)).getFullYear()}`  }}
          </div>
          <div>SDT:  {{userData.SDT}}</div>
          <div>Địa chỉ:  {{userData.DiaChi}}</div>
          <div>CMND:  {{userData.CMND}}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Xác Nhận" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container>
      <div class="q-ma-md">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import {mapActions, mapState} from "vuex";
import {logOut} from "src/store/config/actions";
import {connection} from "boot/connection";

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  computed: {
    ...mapState('config', ['isLogged', 'user']),
  },
  async mounted() {
    this.$q.loading.show()

    this.role = localStorage.getItem('role')
    this.user = JSON.parse(localStorage.getItem('user'))

    if (this.role === 'user') {
      await this.getUSer(this.user.idUser)

    }
    if (this.role === 'admin') {
      await this.getAdmin(this.user.idAdmin)
    }

  },
  data () {
    return {
      drawer: false,
      tab: '/main',
      userDialog: false,
      userData: {},
      role: null,
      user: null
    }
  },
  methods: {
    ...mapActions('config', ['logOut']),
    hasRole(role) {
      if (localStorage.getItem('role') === role) {
        return true
      }
      return false
    },
    clickIn(payload) {
      this.tab = payload
      if (this.$router.currentRoute.path !== payload) {
        this.$router.replace(payload)
      }

    },
    async onLogOut() {
        await this.logOut()
        this.$q.notify({
          message: 'Logout success',
          color: 'positive',
          position: 'top'
        })

    },
    async getUSer(id) {

      var query = `SELECT nguoidung.idUser,loainguoidung.TenLoaiNguoiDung, nguoidung.HoTen, nguoidung.NgaySinh, nguoidung.DiaChi, nguoidung.SDT, nguoidung.CMND
                  FROM qlthuvien.nguoidung inner JOIN loainguoidung
                  on loainguoidung.idLoaiNguoiDung = nguoidung.idLoaiNguoiDung where nguoidung.idUser = ${id}`

       return connection.query(query, (err, row, field) => {
         this.userData = row[0]

         this.$q.loading.hide()
         return
      })

    },
    getAdmin(id) {
      var query = `SELECT  * FROM thongtinadmin where idAdmin = ${id}`

      return connection.query(query, (err, row, field) => {
        this.userData = row[0]
        console.log(this.userData)
        this.$q.loading.hide()
        return
      })
    }
  }
}
</script>
