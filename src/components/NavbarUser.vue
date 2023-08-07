<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/user" class="navbar-brand logo custom-logo">Freelance Usluge</router-link>
      
      <div class="dropdown ms-auto" style="margin-right: 30px;">
        <button
          class="btn btn-dark dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            class="rounded-circle"
            src="../../usluge/profilna_Stipe.jpg"
            alt="Profilna slika"
            width="50"
            height="50"
          />
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li><router-link to="/user/profile" class="dropdown-item">Profil</router-link></li>
          <li><a class="dropdown-item" href="#">Upravljaj objavama</a></li>
          <li><a class="dropdown-item" href="#">Upravljaj korisnicima</a></li>
          <li><a class="dropdown-item" href="#">Upravljaj uslugama</a></li>
          <li><a class="dropdown-item" href="#">Odjavi se</a></li>
        </ul>
      </div>
      
    </nav>
</template>

<script>
export default {
  name: 'NavbarUser',
}
</script>

<style>
  .custom-logo {
        margin-left: 20px;
        color: white !important;
    }

    .custom-logo:hover {
        cursor: pointer; 
    }
    
</style>