function! s:enable() abort
  let b:skkomplete_spill = ddc#custom#get_buffer()
  call ddc#custom#patch_buffer(#{
  \   sources: ['skkomplete'],
  \   sourceOptions: #{
  \     skkomplete: #{
  \       converters: [],
  \       matchers: [],
  \       sorters: [],
  \       isVolatile: v:true,
  \     }
  \   }
  \ })
endfunction

function! s:disable() abort
  if has_key(b:, 'skkomplete_spill')
    call ddc#custom#set_buffer(b:skkomplete_spill)
    unlet b:skkomplete_spill
  endif
endfunction

augroup skkomplete
  autocmd InsertLeave * call s:disable()
augroup END

nnoremap si i<Cmd>call <SID>enable()<CR>
