<template>
    <div class="footer-wrapper">
      <div class="footer bg-light">
        <ul class="social-icons d-flex">
          <li><a href="https://www.instagram.com/" target="blank"><i class="fab fa-instagram text-dark fa-border"></i></a></li>
          <li><a href="https://www.facebook.com/" target="blank"><i class="fab fa-facebook text-dark fa-border"></i></a></li>
          <li><a href="https://twitter.com/" target="blank"><i class="fab fa-twitter text-dark fa-border"></i></a></li>
          <li><a href="https://www.linkedin.com/" target="blank"><i class="fab fa-linkedin text-dark fa-border"></i></a></li>
        </ul>
      </div>
      <div class="footer bg-dark text-white">
        <p class="py-2">Freelance Services. Allrights reserved.</p>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'Footer',
  };
</script>

<style>
    .social-icons {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
        margin-left: 20vw;
        margin-right: 20vw;
        margin-top: 20px;
    }
    .fa-border {
        border: 1px solid black !important;
        border-radius: 50% !important;
        padding: 5px;
    }
    .social-icons i:hover {
        background-color: #212529;
        color: white !important;
        border-radius: 50%;
    }
    .social-icons li{
        font-size: 26px;
        margin-bottom: 20px;
    }

</style>
  