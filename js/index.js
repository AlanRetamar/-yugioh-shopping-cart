    $content = document.querySelector(".content"),
      $contentTop = $content.offsetTop,
      $links = document.querySelectorAll('.nav a')
    window.addEventListener("scroll", fixnavbar)

    document.querySelector('.menu-bar').addEventListener('click', function () {
      document.querySelector('.nav').classList.toggle('show')
    })

    $links.forEach($link => {
      $link.addEventListener('click', e => {
        document.querySelector('.nav').classList.toggle('show')
      })
    });


    function fixnavbar() {
      if (window.scrollY >= $contentTop) {
        document.body.style.paddingTop = $content.offsetHeight + "px"
        document.body.classList.add("fixed-nav")
      } else {
        document.body.style.paddingTop = 0
        document.body.classList.remove("fixed-nav")
      }
    }