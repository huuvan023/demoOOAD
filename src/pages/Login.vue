<template>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="absolute-top">
        <div class="divider-header">
        </div>
        <q-toolbar class="bg-white text-black">
        </q-toolbar>
      </q-header>

      <q-page-container class="flex justify-center">
        <div class="col-10 q-mt-xl-lg q-mt-lg-md q-mt-md-sm text-center">
          <div class="content fluid-type q-mt-xl text-weight-medium">Thư Viện Mở</div>

          <div class="q-mt-xl-md q-mt-md-xs row full-width">
            <form class="col-12 row q-mx-auto">
              <q-input outlined v-model="userName" class="q-mt-xl full-width" label="Enter username"/>
              <q-input v-model="passWord" class="q-mt-lg full-width" label="Enter password" outlined
                       :type="isPwd ? 'password' : 'text'" @keyup.enter="login"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <div class="q-mx-auto full-width">
                <q-radio v-model="role" val="user" label="Người dùng" />
                <q-radio v-model="role" val="admin" label="Admin" />
              </div>
              <q-btn class="q-my-lg q-px-md text-h6 q-mx-auto" color="primary" @click="login" label="Đăng nhập"/>
            </form>
          </div>
        </div>
      </q-page-container>
    </q-layout>
</template>

<script>
import {connection} from "boot/connection";
import {mapActions} from "vuex";

export default {
  name: "Login",
  data: () => ({
    userName: "admin",
    passWord: "1",
    isPwd: false,
    role: 'user'
  }),
  methods: {
    ...mapActions('config', ['LoginSuccess']),
    async login() {
      var query = ''
      if (this.role === 'user') {
        query = `SELECT * FROM docgia WHERE username = '${this.userName}' AND password = '${this.passWord}'`;
      }
      if (this.role === 'admin') {
        query = `SELECT * FROM admin WHERE username = '${this.userName}' AND password = '${this.passWord}'`;
      }
      await connection.query(query, async (err, row, field) => {
        if (err) {
          this.$q.notify({
            message: err,
            color: 'negative',
            position: 'top'
          })
          return
        }
        if (row) {
          if (row.length > 0) {
            this.$q.notify({
              message: 'Login success',
              color: 'positive',
              position: 'top'
            })

            await this.LoginSuccess({data:row[0], role: this.role})
            this.$router.replace('/main')
          }
          else {
            this.$q.notify({
              message: 'Incorrect username or password',
              color: 'negative',
              position: 'top'
            })
          }
        }
        return
      })
    },
  }
}
</script>

<style scoped>
.divider-header {
  background-image: linear-gradient(to right, #197EB9, #5CB569);
  min-height: 20px;
}



.content {
  color: #686868;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}


.fluid-type {
  font-size: 40px;
}
.fluid-title {
  font-size: 15px;
}

@media screen and (min-width: 320px) {
  .fluid-type {
    font-size: calc(30px + 8 * ((100vw - 320px) / 960));
  }
  .fluid-title {
    font-size: calc(15px + 8 * ((100vw - 320px) / 960));
  }
}
@media screen and (min-width: 780px) {
  .fluid-type {
    font-size: calc(40px + 8 * ((100vw - 320px) / 960));
  }
  .fluid-title {
    font-size: calc(18px + 8 * ((100vw - 320px) / 960));
  }
}
@media screen and (min-width: 1280px) {
  .fluid-type {
    font-size: calc(45px + 8 * ((100vw - 320px) / 960));
  }
  .fluid-title {
    font-size: 22px;
  }
}
</style>

