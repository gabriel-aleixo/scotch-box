<div id="site-search" class="site-search">
	<form role="search" method="get" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">

			<input type="text" value="" name="s" id="s" placeholder="<?php echo esc_attr_x( 'Search &hellip;', 'placeholder', 'writings' ); ?>">

			<button type="submit" class="button search-submit">
				<svg class="icon icon-search" aria-hidden="true" role="img"><use href="#icon-search" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-search"></use></svg>
				<span class="screen-reader-text"><?php echo esc_html_x( 'Search', 'submit button', 'writings' ); ?></span>
			</button>

	</form>
</div>