<template>
    <h1>User: {{$route.params.id}}</h1>
</template>

<script>
export default {
    validate (data) {
        return /^\d+$/.test(data.params.id);
    },
    layout: 'users'
}
</script>