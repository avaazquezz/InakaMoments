<template>
  <main class="py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold mb-3">Legal</p>
        <h1 class="text-3xl font-bold text-inaka-terra sm:text-4xl">Política de privacidad</h1>
      </div>

      <div class="prose prose-inaka max-w-none space-y-8 text-inaka-terra/75">
        <p class="text-sm text-inaka-terra/60">Última actualización: {{ new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales facilitados a través de este sitio web es <strong>Inaka Moments</strong> (en adelante, "la empresa"), con domicilio en Abrera, Cataluña, España, y correo electrónico de contacto: <a href="mailto:nadine.tcae@gmail.com" class="text-inaka-gold hover:underline">nadine.tcae@gmail.com</a>.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">2. Datos recopilados</h2>
          <p>Los datos personales que recopilamos a través del formulario de contacto son:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Nombre y apellidos</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono (WhatsApp)</li>
            <li>Información sobre el evento (tipo, fecha, número de invitados, espacios de interés, estilo)</li>
            <li>Cualquier información adicional que el usuario facilite voluntariamente</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">3. Finalidad del tratamiento</h2>
          <p>Sus datos personales serán utilizados con las siguientes finalidades:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Gestionar y dar respuesta a las solicitudes de información y presupuestos recibidas a través del formulario.</li>
            <li>Enviar comunicaciones comerciales relacionadas con los servicios de la empresa, siempre con el consentimiento previo del usuario.</li>
            <li>Mejorar la calidad del servicio y la experiencia del usuario en el sitio web.</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">4. Legitimación</h2>
          <p>
            La base legal para el tratamiento de sus datos es el <strong>consentimiento explícito</strong> del usuario, manifestado mediante el envío del formulario de contacto, así como la <strong>ejecución de medidas precontractuales</strong> solicitadas por el usuario.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">5. Conservación de los datos</h2>
          <p>
            Los datos personales proporcionados se conservarán mientras el usuario no solicite su supresión y, en todo caso, durante un plazo máximo de <strong>2 años</strong> desde el último contacto mantenido, salvo que la ley aplicable exija un período de conservación superior.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">6. Destinatarios y encargados del tratamiento</h2>
          <p>
            Sus datos no serán cedidos a terceros, excepto cuando así lo exija la legislación vigente. Para la prestación del servicio utilizamos los siguientes proveedores, que actúan como encargados del tratamiento:
          </p>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Supabase</strong> (base de datos y almacenamiento): las solicitudes de presupuesto se almacenan en servidores ubicados en la <strong>Unión Europea (París, Francia)</strong>.</li>
            <li><strong>Servicios de envío de correo electrónico</strong> (Resend / EmailJS): utilizados únicamente para notificar su solicitud y responderle.</li>
            <li><strong>Cloudflare Turnstile</strong> (verificación anti-spam del formulario): puede tratar datos técnicos de conexión para distinguir personas de robots.</li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">7. Derechos del usuario</h2>
          <p>Usted tiene derecho a:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Acceder a sus datos personales.</li>
            <li>Rectificar datos inexactos o incompletos.</li>
            <li>Suprimir sus datos personales.</li>
            <li>Limitar el tratamiento de sus datos.</li>
            <li>Oponerse al tratamiento de sus datos.</li>
            <li>Portabilidad de sus datos.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, puede enviar un correo electrónico a <a href="mailto:nadine.tcae@gmail.com" class="text-inaka-gold hover:underline">nadine.tcae@gmail.com</a> indicando claramente qué derecho desea ejercer.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">8. Uso de cookies</h2>
          <p>
            Este sitio web utiliza únicamente <strong>cookies técnicas esenciales</strong>, necesarias para el funcionamiento del sitio (por ejemplo, la sesión del panel de administración o la verificación anti-spam del formulario). No utilizamos cookies publicitarias, de rastreo ni de perfilado. Si en el futuro se incorporasen cookies analíticas, se solicitará su consentimiento previo mediante el gestor de cookies.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-inaka-terra">9. Cambios en la política de privacidad</h2>
          <p>
            La empresa se reserva el derecho a modificar la presente política de privacidad para adaptarla a novedades legislativas o jurisprudenciales. En tales casos, los cambios introducidos serán anunciados en esta página.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Política de privacidad — Inaka Moments',
  meta: [
    {
      name: 'description',
      content: 'Política de privacidad de Inaka Moments. Información sobre cómo recopilamos, usamos y protegemos tus datos personales.',
    },
  ],
})
</script>
