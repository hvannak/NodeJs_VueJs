<template>
  <v-card height="100vh">
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          WELCOME TO AGRI-FAMILY
        </h1>

        <p class="subheading font-weight-regular">
          we have collected all agriculture products and services in one place for easy getting informations.
          <br>please contact us online
        </p>
      </v-col>     
    </v-row>
  </v-card>
</template>

<script>
export default {
    data: () => ({
    })
  }
</script>
