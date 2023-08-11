<template>
  <div class="backdrop" @click.self="zatvoriModal">
    <div class="modall">
        <h3>Prijavi se</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" id="email" v-model="formData.email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" id="password" v-model="formData.password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-dark mb-3">Prijavi se</button>
        </form>
        <div class="d-flex justify-content-between">
            <p>Nemate račun?</p>
            <a href="#" class="text-decoration-none text-dark">Zaboravljena lozinka?</a>
        </div>
        <div class="text-start">
            <router-link to="/register" class="p-1 text-decoration-none text-dark border border-dark rounded">Registriraj se</router-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            formData: {
                email: '',
                password: '',
            },
        }
    },
    methods: {
        zatvoriModal() {
            this.$emit('zatvori');
        },
        submitForm() {
            this.$emit('potvrdi', { email: this.formData.email, password: this.formData.password });
        }
    }
}
</script>

<style>
    .modall{
        width: 400px;
        padding: 20px;
        margin: 100px auto;
        background: white;
        border-radius: 10px;
        z-index: 99999;
    }
    .backdrop{
        top: 0;
        position: fixed;
        background: rgba(0, 0, 0, 0.7);
        width: 100%;
        height: 100%;
        z-index: 99998;
    }
</style>