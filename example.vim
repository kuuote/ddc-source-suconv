function! s:enable() abort
  let b:suconv_spill = ddc#custom#get_buffer()
  call ddc#custom#patch_buffer(#{
  \   sources: ['suconv'],
  \   sourceOptions: #{
  \     suconv: #{
  \       converters: [],
  \       matchers: [],
  \       sorters: [],
  \       isVolatile: v:true,
  \     }
  \   }
  \ })
endfunction

function! s:disable() abort
  if has_key(b:, 'suconv_spill')
    call ddc#custom#set_buffer(b:suconv_spill)
    unlet b:suconv_spill
  endif
endfunction

augroup suconv
  autocmd InsertLeave * call s:disable()
augroup END

nnoremap si i<Cmd>call <SID>enable()<CR>
