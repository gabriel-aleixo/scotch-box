<?php

	/*
	 * Display AtomicReach assessment results.
	 * Following class takes the Json formatted result and display it in human friendly format.
	 * See: ../index.php From Line#90 to call each method.
	 * Please take backup before you edit this file.
	 *
	 */

	class meta {

		private $result;
		private $seg;
		private $atomicScore;


		// Contructor getting result from ARClient.php in a form of an object.
		Public function __construct( $obj, $seg, $as ) {
			$this->result      = $obj;
			$this->seg         = $seg;
			$this->atomicScore = $as;
		}

		/*     * *************************** */
		/* Content Sophistication    */
		/* find out more about this:   */
		/* http://www.slideshare.net/atomicreach/how-to-achieve-a-content-sophistication-match-for-your-audience */
		/*     * *************************** */

		public function summaryTab() {
			$out = '<h3>TOP 3 OPPORTUNITIES</h3>
					<ul class="threeOpp ar_spritelist">';

			$stopAtThree = 0;
			$measState   = $this->result->data->analysis;


			// 1 check audience match
			if ( $measState->so->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->so->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Your post is not an audience match. Hit AUDIENCE to find out why.</li>';
				$stopAtThree ++;
			}
			// 2 check if title is not green.
			if ( $measState->tm->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->tm->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Your title needs work. Hit TITLE to find out why.</li>';
				$stopAtThree ++;
			}
			// 3 check length
			if ( $measState->ln->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->ln->state === "yellow" ) ? 'warning' : 'error' ) . '">
								  Length of post is not optimal. Hit STRUCTURE to find out why.</li>';
				$stopAtThree ++;
			}
			// 4 Check Grammar
			if ( $measState->gm->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->gm->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Improve your grammar. Hit LINGUISTICS to find out how.</li>';
				$stopAtThree ++;
			}
			// 5 check if emotion is not green
			if ( $measState->em->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->em->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Your post lacks emotion. Hit AUDIENCE to fix it.</li>';
				$stopAtThree ++;
			}
			// 6 Check Spelling
			if ( $measState->sm->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->sm->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Incorrect spelling detected. Hit LINGUISTICS to find out why.</li>';
				$stopAtThree ++;
			}
			// 7 Links
			if ( $measState->lc->state !== 'green' && $stopAtThree != 3 ) {
				$out .= '<li class="ar_checkmarks_' . ( ( $measState->lc->state === "yellow" ) ? 'warning' : 'error' ) . '">
								Some links aren\'t working. Hit LINGUISTICS to find out more.</li>';
				$stopAtThree ++;
			}
			// 8 Check Topics
			/*if($measState->tpp->state !== 'green' && $stopAtThree != 3){
					echo '';
					$stopAtThree ++;
				}*/

			$out .= '</ul>';

			return $out;


		}

		private function keywordsList() {
			$tg = $this->result->data->analysis->tg;
			if ( $tg->total == 0 ) {
				return "No keywords identified.";
			} else {
				$words = '';
				foreach ( $tg->detail as $val ) {
					$words .= "<span class='keywordPill'>".$val ."</span>";
				}
//				$out = rtrim( $words, ", " );
				$out = $words;
				return $out;
			}
		}

		public function contentSophistication() {
			$num = 0;

			$out = '';
//			$out = '<p style="font-size: 24px;color: #64C1DD; margin-bottom: 0;margin-top: 0;">Format Results</p>' . PHP_EOL;
//			$out .= '<p class="howto" style="margin-top: 0;">Hover over the elements to see more feedback.</p>' . PHP_EOL ;
			$out .= '<article class="ac-large soBox">' . PHP_EOL;

			$out .= '<div>';
			$out .= '<script> var lengthState = ' . json_encode( $this->result->data->analysis->ln->state ) . '; </script>';
			$out .= '<script> var lengthCount = ' . json_encode( $this->result->data->analysis->ln->measured->sentences ) . '; </script>';


//			$lengthState = $this->result->data->analysis->ln->state;
//			$lengthSen   = $this->result->data->analysis->measured->words;
			$ln = $this->result->data->analysis->ln;

			$out .= '<p id="ar-ln"><input id="ln" name="ln" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $ln->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$out .= '<label class="ar_info" for="ln" id="ar-' . $ln->state . '">Length<small> (Aim for 26-75 sentences)</small></label><p>' . PHP_EOL;

			$sm = $this->result->data->analysis->sm;
			$out .= '<script> var spellState = ' . json_encode( $this->result->data->analysis->sm->state ) . '; </script>';
			$out .= '<script> var spellHL = ' . json_encode( $this->result->data->analysis->sm ) . '; </script>';


			$spellState = $this->result->data->analysis->sm->state;

			$out .= '<div class="arMeasureWrapper">' . PHP_EOL;
			$out .= '<p id="ar-sm"><input id="sm" name="sm" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $spellState ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$out .= '<label class="ar_info" for="sm" id="ar-' . $sm->state . '">
			Spelling<small> (' . $this->result->data->analysis->sm->total . ')</small></label></p>' . PHP_EOL;
			if ( strtolower( $spellState ) != "green" ) {
				$out .= '<div id="ar-spellingHighlightButton" class="arInlineButton">';
				$out .= '<div class="onoffswitch">
                <input type="checkbox" id="writer_Spelling" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" >
                 <label class="onoffswitch-label" for="writer_Spelling">
                    <span class="onoffswitch-inner"></span>
                     <span class="onoffswitch-switch-spellings onoffswitch-switch"></span>
                        </label>
                            </div>';
				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;

			// GRAMMAR

			$data = $this->result->data->analysis;
			$allGrammar['detail'] = array_merge( $data->gm->detail, $data->lw->detail, $data->le->detail, $data->ste->detail, $data->pee->detail, $data->pue->detail, $data->sem->detail );
			$allGrammar['total'] = count( $allGrammar['detail'] );
			$allGrammar['state'] = ($allGrammar['total'] > 0) ? 'red' : 'green';

			$out .= '<script> var grammarState = ' . json_encode( $this->result->data->analysis->gm->state ) . '; </script>';
			$out .= '<script> var analysisResult = ' . json_encode( $this->result->data ) . '; </script>';
//			$out .= '<script> var grammarHL = ' . json_encode( $this->result->data->analysis->gm ) . '; </script>';
			$out .= '<script> var grammarHL = ' . json_encode( $allGrammar ) . '; </script>';

			$gm = $this->result->data->analysis->gm;
			$out .= '<div class="arMeasureWrapper">' . PHP_EOL;
			$out .= '<p id="ar-gm"><input id="gm" name="gm" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $gm->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$out .= '<label class="ar_info" for="gm" id="ar-' . $gm->state . '">Grammar<small> (' . $this->result->data->analysis->gm->total . ')</small></label></p>';
			if ( strtolower( $gm->state ) != "green" ) {
				$out .= '<div id="ar-grammarHighlightButton" class="arInlineButton">';
				$out .= '<div class="onoffswitch">';
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" id="writer_Grammar">';
				$out .= '<label class="onoffswitch-label" for="writer_Grammar">';
				$out .= '<span class="onoffswitch-inner"></span>';
				$out .= '<span class="onoffswitch-switch-grammar onoffswitch-switch"></span>';
				$out .= '</label>';
				$out .= '</div>';
				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;


			$linkState = $this->result->data->analysis->lc->state;
			$out .= '<script> var linkState = ' . json_encode( $this->result->data->analysis->lc->state ) . '; </script>';
			$out .= '<script> var linkHL = ' . json_encode( $this->result->data->analysis->lc ) . '; </script>';


			$lc = $this->result->data->analysis->lc;
			$out .= '<div class="arMeasureWrapper">' . PHP_EOL;
			$out .= '<p id="ar-lc"><input id="lc" name="lc" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $lc->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$out .= '<label class="ar_info" for="lc" id="ar-' . $lc->state . '">Links<small> (' . $this->result->data->analysis->lc->invalid . ')</small></label></p>';
			if ( strtolower( $lc->state ) != "green" ) {
				$out .= '<div id="ar-linksHighlightButton" class="arInlineButton">';
				$out .= '<div class="onoffswitch">';
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" id="writer_Links">';
				$out .= '<label class="onoffswitch-label" for="writer_Links">';
				$out .= '<span class="onoffswitch-inner"></span>';
				$out .= '<span class="onoffswitch-switch-links onoffswitch-switch"></span>';
				$out .= '</label>';
				$out .= '</div>';
//				$out .= '<p class="writer_fixes-labels">&nbsp;&nbsp;&nbsp;Links</p>';

				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;
			$out .= '</div>';
			$out .= '<hr/>';


			$out .= '<div style="margin-top: 10px;margin-left:25px">';

			$out .= '<p class="ar_count">Word Count:<span style="color:#464646 !important">&nbsp;&nbsp;' . $ln->measured->words . ' </span></p> ' . PHP_EOL;
			$out .= '<p class="ar_count">Sentence Count:<span style="color:#464646 !important">&nbsp;&nbsp;' . $ln->measured->sentences . ' </span></p> ' . PHP_EOL;
			$pc = count( $this->result->data->analysis->pwd->detail->paragraphs );
			$out .= '<p class="ar_count">Paragraph Count:<span style="color:#464646 !important">&nbsp;&nbsp;' . $pc . ' </span></p> ' . PHP_EOL;
			$out .= '<p class="ar_count">Keywords:<span style="color:#464646 !important; font-size: 12px;">&nbsp;&nbsp;' . $this->keywordsList() . ' </span></p> ' .
			        PHP_EOL;


			$out .= '</div>';
//			$out .= '<hr/>';


			$out .= '</article>' . PHP_EOL;


			$out .= '<div class="writer-spelling_fix writer-hide">';
			$out .= '<p> Spelling Suggestions</p>';
			$out .= '<div>';
			$out .= '<ul class="spellings_list" style="text-align:center !important;background-color: #ffffff !important"></ul>';
			$out .= '<button id="add_dictionary">+ add to dictionary</button>';
			$out .= '</div>';
			$out .= '</div>';

			$out .= '<div class="writer-grammar_fix writer-hide">';
			$out .= '<p>Grammar</p>';
			$out .= '<p class="suggestions_content"></p>';
			$out .= '<p class="suggestions_link"><a class="grammar-suggestion-link" href="">See Explanation</a></p>';
			$out .= '</div>';

			return $out;
		}


		public function readability() {
			$num = 0;

			$out = '';
//			$out = '<p style="font-size: 24px;color: #64C1DD; margin-bottom: 0;margin-top: 0;">Readability Results</p>' . PHP_EOL;
//			$out .= '<p class="howto" style="margin-top: 0;">Hover over the elements to see more feedback.</p>' . PHP_EOL ;
			$out .= '<article class="ac-large soBox">' . PHP_EOL;

			$out .= '<div>';


			//			PWD
			$out .= '<script>var pwdState = ' . json_encode( $this->result->data->analysis->pwd->state ) . '; </script>';
			$out .= '<script> var pwdHL = ' . json_encode( $this->result->data->analysis->pwd ) . '; </script>';


			$pwd = $this->result->data->analysis->pwd;
			$out .= '<div class="arMeasureWrapper arDoubleLN">' . PHP_EOL;
			$out .= '<p id="ar-pwd"><input id="pwd" name="pwd" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $pwd->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$tooLongCount = array_count_values( $pwd->detail->paragraphs );
			$out .= '<label class="ar_info" for="pwd" id="ar-' . $pwd->state . '">Paragraph Density<small> ( ' . $tooLongCount["toolong"] . ' )</small></label></p>';
			if ( strtolower( $pwd->state ) != 'green' ) {
				$out .= '<div id="ar-PWDbtn" class="arInlineButton">';
				$out .= '<div class="onoffswitch">';
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" id="writer_ParaDensity">';
				$out .= '<label class="onoffswitch-label" for="writer_ParaDensity">';
				$out .= '<span class="onoffswitch-inner"></span>';
				$out .= '<span class="onoffswitch-switch-paragraph onoffswitch-switch"></span>';
				$out .= '</label>';
				$out .= '</div>';
				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;
//          PWD END

//			Sentence Complexity
			$so = $this->result->data->analysis->so;
			/*$out .= '<div class="arMeasureWrapper arDoubleLN">' . PHP_EOL;
			$out .= '<p id="ar-so"><input id="so" name="so" type="checkbox" />' . PHP_EOL;
			$out .= '<label style="font-size:19px !important;" class="ar_info" for="so" id="ar-' . $so->state . '">&nbsp;&nbsp;&nbsp;Sentence <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Complexity<small>+</small></label></p>';
			if ( strtolower( $so->state ) != 'green' ) {
				$out .= '<div id="ar-SObtn" class="arInlineButton">';
				$out .= '<div class="onoffswitch">';
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" id="writer_SenComp">';
				$out .= '<label class="onoffswitch-label" for="writer_SenComp">';
				$out .= '<span class="onoffswitch-inner"></span>';
				$out .= '<span class="onoffswitch-switch-sentence"></span>';
				$out .= '</label>';
				$out .= '</div>';
				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;*/
//			Sentence Complexity Ends

//			Word Complexity
			$out .= '<script> var senState = ' . json_encode( $this->result->data->analysis->so->state ) . '; </script>';
			$out .= '<script> var soHL = ' . json_encode( $this->result->data->analysis->so ) . '; </script>';


			$out .= '<div class="arMeasureWrapper arDoubleLN">' . PHP_EOL;
			$out .= '<p id="ar-wc"><input id="wc" name="wc" type="checkbox" />' . PHP_EOL;
			$out .= '<i class="fa fa-2x ' . ( strtolower( $so->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$tooComplexCount = array_count_values( $so->paragraphs );
			if ($tooComplexCount["TOO COMPLEX"] > 0){
				$tooComplexCount = $tooComplexCount["TOO COMPLEX"];
			}else{
				$tooComplexCount = $tooComplexCount["TOO SIMPLE"];
			}


			$out .= '<label class="ar_info" for="wc" id="ar-' . $so->state . '">Word Complexity<small> ( ' . $tooComplexCount . ' ) </small></label></p>';
			if ( strtolower( $so->state ) != 'green' ) {
				$out .= '<div id="ar-WCbtn" class="arInlineButton">';
				$out .= '<div class="onoffswitch">';
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox"
					id="writer_WordComp">';
				$out .= '<label class="onoffswitch-label" for="writer_WordComp">';
				$out .= '<span class="onoffswitch-inner"></span>';
				$out .= '<span class="onoffswitch-switch-word onoffswitch-switch"></span>';
				$out .= '</label>';
				$out .= '</div>';
				$out .= '</div>';
			}
			$out .= '</div>' . PHP_EOL;
//			Word Complexity ENDS


//			EMOTION
			$em = $this->result->data->analysis->em;
			$out .= '<script> var emState = ' . json_encode( $em->state ) . '; </script>';
			$out .= '<script> var emState = ' . json_encode( $em->state ) . '; </script>';
			$out .= '<script> var emWords = ' . json_encode( $em->words ) . '; </script>';
			$out .= '<script> var emotionWordsV2 = ' . json_encode( $this->result->data->analysis->so->emotionWordsV2 ) . '; </script>';
			$out .= '<div class="arMeasureWrapper arDoubleLN">' . PHP_EOL;
			$out .= '<p id="ar-em"><input id="em" name="em" type="checkbox" />' . PHP_EOL;
//			$out .= '<i class="fa fa-2x ' . ( strtolower( $em->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
			$out .= '<i class="fa fa-2x fa fa-info-circle text-muted"></i>' . PHP_EOL;
			$out .= '<label class="ar_info" for="em" id="ar-' . $em->state . '">Emotion<small> ( ' . count( (array) $em->words ) . ' )</small></label></p>' . PHP_EOL;
			if ( strtolower( $em->state ) != 'green' ) {
				$out .= '<div id="ar-EMbtn" class="arInlineButton">' . PHP_EOL;
				$out .= '<div class="onoffswitch">' . PHP_EOL;
				$out .= '<input type="checkbox" style="visibility: hidden !important;display: none !important;" name="onoffswitch" class="onoffswitch-checkbox" id="writer_EM">' . PHP_EOL;
				$out .= '<label class="onoffswitch-label" for="writer_EM">' . PHP_EOL;
				$out .= '<span class="onoffswitch-inner"></span>' . PHP_EOL;
				$out .= '<span class="onoffswitch-switch-emotion onoffswitch-switch"></span>' . PHP_EOL;
				$out .= '</label>' . PHP_EOL;
				$out .= '</div>' . PHP_EOL;
				$out .= '</div>' . PHP_EOL;
			}
			$out .= '</div>' . PHP_EOL;
//			EMOTION END
			$out .= '</div>';
			$out .= '</article>' . PHP_EOL;

			return $out;
		}


		public function titleOptimization() {
			$tm  = $this->result->data->analysis->tm;
			$out = '<div class="' . $this->DOMsort( $tm->state ) . '">' . PHP_EOL;
//			$out .= '<p id="AWtitleHeading" >Title Results</p>' . PHP_EOL;
			$out .= '<p id="AWtitleSubHeading">Try up to 6 of the following.</p>' . PHP_EOL;
			$out .= '<article class="ac-large tmBox">' . PHP_EOL;


			//	tags for keywords

			$out .= '<script> var tgKeywords = "' . $this->keywordsList() . '"; </script>';


			if ( $tm->detail >= 0 ) {
				foreach ( $tm->dimensions as $i => $v ) {
					$disabled = array();//array( "TitleQuestion", "TitleContainsNumbers", "TitleContainsHowTo" );
					$code     = $v->name;
					if ( ! in_array( $code, $disabled, FALSE ) ) {
						switch ( $code ) {
							case "titleCharacterCount":
								$out .= '<p data-sort="10" class="titleMeasure" id="ar_cc"><input id="wc" name="cc" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info" for="cc" id="ar-' . $v->state . '">Character Count</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleWordsCount":
								$out .= '<p data-sort="20" class="titleMeasure" id="ar-wcount"><input id="wc" name="wc" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                               for="wc" id="ar-' . $v->state . '">Word count</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleSuperlatives":
								$out .= '<p data-sort="30" class="titleMeasure" id="ar-super"><input id="super" name="kword" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                                for="super" id="ar-' . $v->state . '">Superlatives</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titlePolarity":
								$out .= '<p data-sort="40" class="titleMeasure" id="ar-polarity"><input id="polarity" name="polarity" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                               for="polarity" id="ar-' . $v->state . '">Emotion</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titlePronounPerson":
								$out .= '<p data-sort="50" class="titleMeasure" id="ar-pronoun"><input id="super" name="pronoun" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                                for="pronoun" id="ar-' . $v->state . '">Pronoun</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help  titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleContainsNumbers":
								$out .= '<p data-sort="60" class="titleMeasure" id="ar-n"><input id="caps" name="n" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                               for="n" id="ar-' . $v->state . '">Numbers</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleContains5W1H":
								$out .= '<script> var titleKeywordState = ' . json_encode( $v->state ) . '; </script>';
								$out .= '<p data-sort="70" class="titleMeasure" id="ar-wh"><input id="wh" name="wh" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info" for="wh" id="ar-' . $v->state . '">5 W\'s </label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleQuestion":
								$out .= '<p data-sort="80" class="titleMeasure" id="ar-q"><input id="q" name="q" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                               for="q" id="ar-' . $v->state . '">Question Mark</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleTopicLocation":
								$out .= '<p data-sort="90" class="titleMeasure" id="ar-l"><input id="l" name="L" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"
                                               for="l" id="ar-' . $v->state . '">Keyword(s) location</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

							case "titleTopicsCount":
								$out .= '<script> var titleKeywordState = ' . json_encode( $v->state ) . '; </script>';
								$out .= '<p data-sort="95" class="titleMeasure" id="ar-tc"><input id="tc" name="tc" type="checkbox" />' . PHP_EOL;
								$out .= '<i class="fa fa-2x ' . ( strtolower( $v->state ) != "green" ? " fa-times-circle text-red" : "fa-check-circle text-green" ) . '"></i>' . PHP_EOL;
								$out .= '<label class="ar_info"  for="tc" id="ar-' . $v->state . '">Keywords</label>' . PHP_EOL;
								$out .= '<span class="dashicons dashicons-editor-help titleTooltip" title="' . $v->recommendations[0] . '"></span></p>';
								break;

						} // switch
					} //in array
				}// foreach


			} //detail

			$out .= '<p data-sort="99" class="titleMeasure ar_count">Keywords:<span style="color:#464646 !important; font-size: 12px;">&nbsp;&nbsp;' . $this->keywordsList() . ' </span></p> ' .
			        PHP_EOL;

			$out .= '</article>' . PHP_EOL;
			/*	$out .= '<div id="aw_moretips_WP">' . PHP_EOL;
				$out .= '<p style="cursor: pointer !important;font-family: \'Roboto\', sans-serif"><i>+ More Title Tips</i></p>' . PHP_EOL;
				$out .= '<ul id="aw_titletips_WP" style="display: none;">' . PHP_EOL;
				$out .= '<li>"How to" articles can increase audience engagement</li>' . PHP_EOL;
				$out .= '<li>In listicles, numbers are easier to read than words</li>' . PHP_EOL;
				$out .= '<li>Headlines formed as a question provoke curiosity in a reader</li>' . PHP_EOL;
				$out .= '</ul>' . PHP_EOL;
				$out .= '<br>' . PHP_EOL;
				$out .= '</div>' . PHP_EOL;*/
			$out .= '</div>' . PHP_EOL;

			return $out;
		}

		public function displayHighlightsButtons() {
			if ( $this->result->data->analysis->gm->total > 0 || $this->result->data->analysis->lc->invalid > 0 || strtolower
				( $this->result->data->analysis->so->state !== 'green' ) || strtolower( $this->result->data->analysis->pwd->state !== 'green' )
			):
				$out = '';
				$out .= '<strong style="clear: both;display: table;padding: 0 25px;">Select a category to highlight areas to refine:</strong>';
				$out .= '<ul id="" class="hl-btns">';
//      if ($this->result->data->analysis->sm->total > 0):
//        $out .= '<li>';
//        $out .= '<input type="checkbox" id="chksp" name="chk" value="all">
//<label for="chksp">Spelling Mistakes</label>
//</li>';
//      endif;
				if ( $this->result->data->analysis->gm->total > 0 ):
					$out .= '<li>
<input type="checkbox" id="chkgm" name="chk"value="false">
<label for="chkgm">Grammar Mistakes</label>
</li>';
				endif;
				if ( $this->result->data->analysis->lc->invalid > 0 ):
					$out .= '<li>
<input type="checkbox" id="chkul" name="chk" value="true">
<label for="chkul">Underperforming Links</label>
</li>';
				endif;
				if ( strtolower( $this->result->data->analysis->so->state !== 'green' ) ):
					$out .= '<li>
<input type="checkbox" id="chkso" name="chk" value="false" class="' . strtolower( str_replace( " ", "-", $this->result->data->analysis->so->detail ) ) . '">
<label for="chkso">Audience Mismatch</label>
</li>';
					$light_blue   = '#91c7f9';
					$light_orange = '#FFA20C';
					$out .= '
<script>
jQuery("#chkso").data("paragraphs",' . json_encode( $this->result->data->analysis->so->paragraphs ) . ');
jQuery("#chkso").data("domExpression",' . json_encode( $this->result->data->analysis->so->paragraphDOM ) . ');
jQuery("#chkso").data("tooSimpleColor",' . json_encode( $light_blue ) . ');
jQuery("#chkso").data("tooComplexColor",' . json_encode( $light_orange ) . ');
</script>';
				endif;

				// PARAGRAPH DENSITY
				if ( strtolower( $this->result->data->analysis->pwd->state !== 'green' ) ):
					$out .= '<li>
<input type="checkbox" id="chkpwd" name="chk" value="true">
<label for="chkpwd">Paragraph Density</label>
</li>';
					$out .= '
        <script>
        var PWDtooShortColor = ' . json_encode( '#F6C9CB' ) . ';
        var PWDtooLongColor = ' . json_encode( '#C98BD1' ) . ';
        var PWDparagraphs = ' . json_encode( $this->result->data->analysis->pwd->detail->paragraphs ) . ';
        var PWDdomExpression = ' . json_encode( $this->result->data->analysis->pwd->detail->paragraphDOM ) . ';
</script>';
				endif; // end para density


				$out .= '</ul>';

				return $out;
			endif;
		}

		public function displayScore() {
			$score       = $this->result->data->scoring;
			$audience    = $this->result->data->analysis->so;
			$atomicScore = $this->atomicScore;

			$over50 = ($this->result->data->over50) ? 'true' : 'false';
			$below50 = ($this->result->data->below50) ? 'true' : 'false';

			$out         = '';

			$out .= '<script>var ARTICLESCORE = ' . $score . '; var ATOMICSCORE = ' . $atomicScore . ';</script>';
			$out .= '<script>var AROVER50 = ' . $over50 . '; var ARBELOW50 = ' . $below50 . ';</script>';


//    $out  = '<div class="ar-score-wrapper">';
//    $out .= '</div>';


			$out .= '<div id="audienceWrapper" class="border-bottom card-content">

				<div id="targetandactual" class="text-center padding-bottom-20">
					<i class="fa fa-circle fa-3x so-target color-aud color-aud-' . $audience->target . '">
					</i>
					<span style="top: -10px;margin: 10px 10px 0 10px;" class="dashicons dashicons-arrow-right-alt" aria-hidden="true"></span>
					<i class="fa fa-circle fa-3x so-actual  color-aud-' . $audience->actual . '"></i>
				</div>


				<p class="text-center so-target" style="margin-bottom: 0;"><span>' . $audience->detail . '</span> for <strong>' . $audience->target . '</strong> audience.</p>

				<p class="text-center so-actual" >Matches <strong>' . $audience->actual . '</strong> audience.</p>

				<button id="changeAudience" class="btn  btn-lg center-block atomicSecondaryColour" style="margin-top: 20px">CHANGE AUDIENCE</button>

			</div>';

			/*$out .= '<div style="    overflow: hidden;
    padding-top: 25px;
    border-top: 13px solid #64C1DD !important;
    border-right: 4px solid #64C1DD;
    border-left: 4px solid #64C1DD;
    border-bottom: 4px solid #64C1DD;">';
			$out .= '<div class="" style="float:left;">';
			$out .= '<div class="ar-score-container"><span>' . $score . '</span></div>';
			$out .= '<p style="margin-left: 43px;font-size: 18px;font-weight: bold;">Score </p></div>';

			$out .= '<div class="" style="float:right;">';
			$out .= '<div class="ar-aud-match">';
			if ( $this->result->data->analysis->so->target == 'General' ) {
				if ( $this->result->data->analysis->so->detail == 'TOO SIMPLE' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_general_simple.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'TOO COMPLEX' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_general_complex.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'HIT' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_general_match.png" />';
				}
			}


			if ( $this->result->data->analysis->so->target == 'Knowledgeable' ) {
				if ( $this->result->data->analysis->so->detail == 'TOO SIMPLE' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_knowledge_simple.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'TOO COMPLEX' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_knowledge_complex.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'HIT' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_knowledge_match.png" />';
				}
			}

			if ( $this->result->data->analysis->so->target == 'Specialist' ) {
				if ( $this->result->data->analysis->so->detail == 'TOO SIMPLE' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_specialist_simple.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'TOO COMPLEX' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_specialist_complex.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'HIT' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_specialist_match.png" />';
				}
			}

			if ( $this->result->data->analysis->so->target == 'Academic' ) {
				if ( $this->result->data->analysis->so->detail == 'TOO SIMPLE' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_academic_simple.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'TOO COMPLEX' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_academic_complex.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'HIT' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_academic_match.png" />';
				}
			}

			if ( $this->result->data->analysis->so->target == 'Genius' ) {
				if ( $this->result->data->analysis->so->detail == 'TOO SIMPLE' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_genius_simple.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'TOO COMPLEX' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_genius_complex.png" />';
				} elseif ( $this->result->data->analysis->so->detail == 'HIT' ) {
					$out .= '<img src="' . MY_PLUGIN_PATH . 'custom/imgs/aw_audience_genius_match.png" />';
				}
			}


			$out .= '<span style="clear: both;display: table;"></span>';

			$out .= '</div>';
			$soActual = $this->result->data->analysis->so->target;
			if ( $this->result->data->analysis->so->detail == 'HIT' ) {
				$out .= '<p style="font-size: 18px;font-weight: bold;margin-top: 0; text-align: center;">Audience Match</p></div>';
			} else {
				$out .= '<p style="font-size: 18px;font-weight: bold;margin-top: 0; text-align: center;">For ' . $soActual . '</p></div>';
			}

			$out .= '</div>';*/


//
//        $out .= '<div class="ar-progress">';
//        $out .= '<div class="ar-bar bar-danger" style="width: 50%;"></div>';
//        $out .= '<div class="ar-bar bar-warning" style="width: 30%;"></div>';
//        $out .= '<div class="ar-bar bar-success" style="width: 20%;"></div>';
//        $out .= '<div class="ar-score" style="left:' . $score . '%;"><i class="fa fa-long-arrow-up"></i></div>';
//        $out .= '</div>';
//        $out .= '<div class="ar-score-message">' . $msg . '</div>';
			return $out;
		}

		public function displayResult() {
			return $this->result;
		}

		public function DOMsort( $state ) {
			if ( strtolower( $state ) == "green" ) {
				return "elem3";
			} else if ( strtolower( $state ) == "yellow" ) {
				return "elem2";
			} else if ( strtolower( $state ) == "red" ) {
				return "elem1";
			}
		}

		// this is not actual atomicScore.
		public function atomicScore() {
			return $this->result->data->scoring;
		}

	}

?>
