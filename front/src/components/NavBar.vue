        <div class="user-menu" v-if="showMenu">
          <router-link to="/perfil" class="menu-item" v-if="isAuthenticated">
            <i class="fas fa-user"></i> Mi Perfil
          </router-link>
          <a href="#" class="menu-item" @click="logout" v-if="isAuthenticated">
            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
          </a>
        </div> 